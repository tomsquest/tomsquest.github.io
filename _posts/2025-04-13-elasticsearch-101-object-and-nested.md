---
title: "Elasticsearch 101: Object vs Nested"
lang: en
image: /assets/images/posts/2025-04-13-elasticsearch-101-object-and-nested/object_versus_nested.png
---

Interview question on Elasticsearch: what is the difference between object and nested data types?

## TL;DR

* `object`: Flattens fields, losing associations between fields in the same object
* `nested`: Preserves object integrity by creating hidden documents for each object
* `nested` is required to relate fields together
* `nested` has performance costs
* `flattened` is an alternative for arbitrary keys (all values treated as keywords)

## The Differences

Object:
- Flattens the structure (field names are concatenated)
- Relationships between fields in the same object are lost

Nested:
- Store each nested object as a separate hidden document
- Preserves relationships between fields
- Requires special query syntax (`nested` query)

## Example

```
PUT my_index
{
  "mappings": {
    "properties": {
      "attributes": {
        "type": "nested",
        "properties": {
          "code": { "type": "text" },
          "value": { "type": "keyword" }
        }
      },
    }
  }
}
```

This enables to query for specific combinations of `code` and `value` within the same object.

For example, we want all documents with an attribute of `code: color` and `value: red`.  
This is not possible with `object` type, as it flattens the structure.

```
GET my_index/_search
{
  "query": {
    "nested": {
      "path": "attributes",
      "query": {
        "bool": {
          "must": [
            { "match": { "attributes.code": "color" }},
            { "match": { "attributes.value": "red" }}
          ]
        }
      }
    }
  }
}
```