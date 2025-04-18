---
title: Improving Elasticsearch Performance with Compression in Node.js
lang: en
image: /assets/images/posts/2025-03-23-elasticsearch-enable-compression/compression.png
---

When using Elasticsearch in Node.js apps, there's a simple performance optimization many developers miss: **compression is not enabled by default**.

## TL;DR

* **Enable** compression in Elasticsearch Node.js client: `compression: true`
* **Not enabled** by default (except with `cloud` option)
* Reduces bandwidth usage and improves response times

## Why Compression Matters

Elasticsearch responses can be large, especially with multiple documents or complex aggregations:

- **Reduces data size**: Often by 30-70% over plain json (from what I found)
- **Speeds up requests & responses**: Less data transfer = faster results

## Implementation

```javascript
import { Client, ClientOptions } from "@elastic/elasticsearch";

const client = new Client({
  node: 'your-host',
  
  // Enable GZIP compression (default: false)
  compression: true,
});
```

The [Basic Configuration page](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/basic-config.html) of Elastic.js lists all available options.

## Conclusion

A quick-win for some performance gain. Always enable compression when working with Elasticsearch in Node.js. 

And by the way, I don't know why it's not the default in 2025 🤷‍♂️ (broader compatibility certainly?).