---
title: Streaming data from BigQuery with TypeScript, Fast!
lang: en
---

How to read from BigQuery in the fastest possible way?
Let's explore three different ways, from normal to the fastest one I know.

**TL;DR**
- Fastest: stream using BigQuery Storage and **Avro**
- Faster: stream using BigQuery Storage and **Arrow**
- Normal: plain BigQuery stream
- BigQuery Storage has some important limits ([see below](#limits))

## Code samples

I provide here some functions, written in TypeScript.

It should not be hard to convert to Python or other, given Google provides the Client in that language.

## Start: no streaming at all

For a start, given a few thousand rows to read, get them directly without any streaming shenanigans.

Be careful with memory consumption though because we load a bunch of data at once.

```typescript
import { BigQuery } from "@google-cloud/bigquery";

type Row = {
  name: string;
}

export const read = async (bigQuery: BigQuery): Promise<Row[]> => {
  const query = `
    SELECT name
    FROM person
    ORDER BY name ASC
  `;

  const [job] = await bigQuery.createQueryJob({query});
  const [rows] = await job.getQueryResults();
  return rows as Row[];
}
```

## Regular streaming

Let's go for streaming!

Here we get rows one by one, lowering memory usage, thus being more efficient.

With that method, you have access to any SQL query you want, which will **not** be the case with the other streaming methods below.

Notice BigQuery's `createQueryStream()` returns a `ResourceStream` which is a kind of `AsyncGenerator`.  
And we need to cast it to `ResourceStream<Row>` because the thing does not accept a Generic sadly, and is `any` by default.

```typescript
import { BigQuery } from "@google-cloud/bigquery";
import { ResourceStream } from "@google-cloud/paginator";

type Row = {
  name: string;
}

export const read = (bigQuery: BigQuery): ResourceStream<Row> => {
  const query = `
    SELECT name
    FROM person
    ORDER BY name ASC
  `;

  return this.bigQuery.createQueryStream({ query }) as ResourceStream<Row>;
}
```

## BigQuery Storage 

[BigQuery Storage](https://cloud.google.com/nodejs/docs/reference/bigquery-storage/latest) is another way to read (and write) from/to BigQuery.

> BigQuery Storage API does not provide functionality related to managing BigQuery resources such as datasets, jobs, or tables.
> 
> When you use the Storage Read API, structured data is sent over the wire in a binary serialization format. 
> This allows for additional parallelism among multiple consumers for a set of results.
> 
> [Documentation](https://cloud.google.com/bigquery/docs/reference/storage):

In theory, BigQuery Storage will fill our performance need, providing a newer and faster approach to reading.

In short:
- Faster reads that traditional streaming
- Some sort of read parallelism
- Some important limits ([see limits below](#limits))

### Limits

#### 1. Only read one table, no query, nor a view

The only thing you can stream is a **Table**!

From what we know, technically, BigQuery Storage streams the "files" containing the data. Thus, it cannot "join" files. 
Forget any fancy SQL query. 😢

Also, forget to be smart. It cannot also stream a View 😿 (as we are streaming "files" at the end).

Still, two things can restrict the data:
- `selectedFields` list the columns to read, eg. `selectedFields: ["name", "age"]`
- `rowRestriction` is a kind of `WHERE` clause, eg. `rowRestriction: "name IS NOT NULL and age >= 18"`

#### 2. Session time

To read, you open a "read session." This session is opened for **6 hours**, and will be closed eventually by BigQuery.

This can be short in certain circumstances. And it seems there is no way to extend the duration.

#### 3. Errors

We got some random errors, like `RST_stream`, or unable to create a read session.  
So remember to retry in case of errors.

### Avro and Arrow way of streaming

Two "protocols" are available when using BigQuery Storage :

1. Apache Avro (best ⭐)
2. Apache Arrow

### Differences between Avro and Arrow formats

- Apache Avro is a binary format that you decode using a Schema that knows where the data is in the binary buffer (a "Type")
- Apache Arrow is a columnar format, so basically, you get an array of array from BigQuery

### Speeds

Here is very roughly the order of magnitude we get reading a single table (each row is huge, lots of info per row):
- BigQuery streaming: 100 reads per second
- BigQuery Storage + Arrow: 200 reads per second
- BigQuery Storage + Avro: 300 reads per second

⚠️ Caveat emptor: your numbers will vary. In our tests, Avro always won the race.

### Which one?

- For Speed: Avro 
- For Simplicity: Avro
- For Understanding deserialization: Arrow

Well, I would go for Avro in all cases, except when you need that structure of Column/Row for some purpose.

### Streaming in Avro ⭐

Here is some helper function, `streamTable` to read a table, specified by its full name `project.dataset.table.`.

Notice:
- `rowRestriction` is a kind of `WHERE` clause
- `selectedFields` is the list of columns to read
- We only open a single read session, else it would imply to process each session in workers (more complex code)
- We get timestamps as numbers, but we convert them back to `Date`

```typescript
import { BigQueryReadClient } from "@google-cloud/bigquery-storage";
import avro, { Schema, Type } from "avsc";
import { CancellableStream } from "google-gax";

export const streamTable = async <ROW>({
  bigQueryReadClient,
  tableFQDN,
  rowRestriction,
  selectedFields,
}: {
  bigQueryReadClient: BigQueryReadClient;
  tableFQDN: string;
  rowRestriction?: string;
  selectedFields?: string[];
}): Promise<AsyncGenerator<ROW>> => {
  const [project, dataset, table] = tableFQDN.split(".");

  const [readSession] = await bigQueryReadClient.createReadSession({
    parent: `projects/${project}`,
    readSession: {
      table: `projects/${project}/datasets/${dataset}/tables/${table}`,
      dataFormat: "AVRO",
      readOptions: {
        rowRestriction,
        selectedFields,
      },
    },

    // Only one session max
    maxStreamCount: 1,
  });

  if (!readSession.streams || readSession.streams.length !== 1) {
    throw new Error(
      `No stream found in read session, or more than one stream found. Streams length: ${readSession.streams?.length}`,
    );
  }

  if (!readSession.avroSchema?.schema) {
    throw new Error("No avroSchema found in read session");
  }

  const schema = JSON.parse(readSession.avroSchema.schema) as Schema;
  const avroType = avro.Type.forSchema(schema, {
    // BigQuery returns timestamps in microseconds, but we want JavaScript Date
    logicalTypes: { "timestamp-micros": TimestampMicrosToDateType },
  });

  const stream = bigQueryReadClient.readRows({
    readStream: readSession.streams[0].name!,
    offset: 0,
  });

  return decodeStream(stream, avroType);
};

async function* decodeStream<ROW>(
  stream: CancellableStream,
  avroType: Type,
): AsyncGenerator<ROW> {
  for await (const data of stream) {
    // As per the official example, we get binary rows and offset from the data
    const row = data as {
      avroRows: { serializedBinaryRows: Buffer & { offset: number } };
    };

    const buffer = row.avroRows.serializedBinaryRows;

    // Decode all rows in buffer
    let position: number | undefined = undefined;
    do {
      const decodedRow = avroType.decode(buffer, position);

      if (decodedRow.value) {
        yield decodedRow.value;
      }

      position = decodedRow.offset;
    } while (position > 0);
  }
}

class TimestampMicrosToDateType extends avro.types.LogicalType {
  override _fromValue(val: number) {
    return new Date(val / 1000);
  }

  override _resolve(type: Type): unknown {
    if (avro.Type.isType(type, "long", "logical:timestamp-micros")) {
      return this._fromValue;
    }
    return super._resolve(type);
  }
}

```

### Streaming in Arrow

Instead of getting data in the Apache Avro format, we can get data in Apache Arrow.

In our tests, this was not the fastest way to read from BigQuery, and the code is more complex than Avro.

Notice:
- We changed the `dataFormat` to `ARROW`
- We use a couple of Node.js Stream Transform, adapted from the official BigQuery Storage client. [See here for the Google code](https://github.com/googleapis/nodejs-bigquery-storage/blob/main/src/reader/arrow_transform.ts).
- The official Google code returns object with `f` and `v` fields. In the code below, we return the original column name.

```typescript
import { BigQueryReadClient } from "@google-cloud/bigquery-storage";
import avro, { Schema, Type } from "avsc";
import { CancellableStream } from "google-gax";
import {DataType, RecordBatch, RecordBatchReader, RecordBatchStreamReader,} from "apache-arrow";
import { Transform, TransformCallback } from "stream";


export const streamTable = async <ROW>({
  bigQueryReadClient,
  tableFQDN,
  rowRestriction,
  selectedFields,
}: {
  bigQueryReadClient: BigQueryReadClient;
  tableFQDN: string;
  rowRestriction?: string;
  selectedFields?: string[];
}): Promise<AsyncGenerator<ROW>> => {
  const [project, dataset, table] = tableFQDN.split(".");

  const [readSession] = await bigQueryReadClient.createReadSession({
    parent: `projects/${project}`,
    readSession: {
      table: `projects/${project}/datasets/${dataset}/tables/${table}`,
      dataFormat: "ARROW",
      readOptions: {
        rowRestriction,
        selectedFields,
      },
    },

    // Only one session max
    maxStreamCount: 1,
  });

  if (!readSession.streams || readSession.streams.length !== 1) {
    throw new Error(
      `No stream found in read session, or more than one stream found. Streams length: ${readSession.streams?.length}`,
    );
  }

  const serializedSchema = readSession.arrowSchema
    ?.serializedSchema as Uint8Array;
  if (!serializedSchema) {
    throw new Error("No arrow schema found in read session");
  }

  const stream = bigQueryReadClient.readRows({
    readStream: readSession.streams[0].name!,
    offset: 0,
  });

  return decodeStream(stream, serializedSchema);
};

async function* decodeStream<ROW>(
  stream: CancellableStream,
  serializedSchema: Uint8Array,
): AsyncGenerator<ROW> {
  for await (const data of stream) {
    // See Google code: 
    // https://github.com/googleapis/nodejs-bigquery-storage/blob/main/src/reader/arrow_transform.ts
    const pipeline = Readable.from([
      data.arrowRecordBatch.serializedRecordBatch,
    ])
    .pipe(new ArrowRawTransform())
    .pipe(new ArrowRecordReaderTransform(serializedSchema))
    .pipe(new ArrowRecordBatchTransform())
    .pipe(new ArrowTransformToRow());

    for await (const row of pipeline) {
      countRows++;
      yield row;
    }
  }
}

class ArrowRawTransform extends Transform {
  constructor() {
    super({ readableObjectMode: false, writableObjectMode: true });
  }

  override _transform(
    batch: unknown,
    _: BufferEncoding,
    callback: TransformCallback,
  ): void {
    callback(null, batch);
  }
}

class ArrowRecordReaderTransform extends Transform {
  private readonly schema: Uint8Array;

  constructor(schema: Uint8Array) {
    super({ objectMode: true });
    this.schema = schema;
  }

  override _transform(
    serializedRecordBatch: Uint8Array,
    _: BufferEncoding,
    callback: TransformCallback,
  ): void {
    const buf = Buffer.concat([this.schema, serializedRecordBatch]);
    const reader = RecordBatchReader.from(buf);
    callback(null, reader);
  }
}

class ArrowRecordBatchTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  override _transform(
    reader: RecordBatchStreamReader,
    _: BufferEncoding,
    callback: TransformCallback,
  ): void {
    const batches = reader.readAll();
    for (const row of batches) {
      this.push(row);
    }
    callback(null);
  }
}

class ArrowTransformToRow extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  override _transform(
    batch: RecordBatch,
    _: BufferEncoding,
    callback: TransformCallback,
  ): void {
    const accRows = new Array(batch.numRows);
    for (let i = 0; i < batch.numRows; i++) {
      accRows[i] = {};
    }
    for (let j = 0; j < batch.numCols; j++) {
      const column = batch.selectAt([j]);
      const field = column.schema.fields[0];
      const columnName = field.name;
      for (let i = 0; i < batch.numRows; i++) {
        const fieldData = column.get(i);
        const fieldValue = fieldData?.toJSON()[columnName];
        accRows[i][columnName] = convertArrowValue(
          fieldValue,
          field.type as DataType,
        );
      }
    }
    for (let i = 0; i < batch.numRows; i++) {
      this.push(accRows[i]);
    }
    callback(null);
  }
}

function convertArrowValue(fieldValue: any, type: DataType): any {
  if (fieldValue === null) {
    return null;
  }
  if (DataType.isList(type)) {
    const arr = fieldValue.toJSON();
    return arr.map((v: any) => {
      const elemType = type.children[0].type;
      return convertArrowValue(v, elemType);
    });
  }
  if (DataType.isStruct(type)) {
    const tableRow: Record<string, unknown> = {};
    Object.keys(fieldValue).forEach((key) => {
      const elemType = type.children.find((f) => f.name === key);
      tableRow[key] = convertArrowValue(
        fieldValue[key],
        elemType?.type as DataType,
      );
    });
    return tableRow;
  }
  if (DataType.isTimestamp(type)) {
    return new Date(fieldValue as number);
  }
  return fieldValue;
}
```

(that deserialization code reminds me some much about mapping from XML/Json to Java, Jax-Rs and such. "Happy" memory 🤔)

## Conclusion

If you have a few thousand rows (that fits in memory), do not stream, get everything in one go.  
Else stream the regular way, as you will get all the power of regular SQL.  

If you need speed and have a single source table, go for BigQuery Storage using the Avro format.
Go for the Arrow format if you need a columnar way of getting the data (think an array of array).

Enjoy streaming as fast as you (or BigQuery) can! 🚀
