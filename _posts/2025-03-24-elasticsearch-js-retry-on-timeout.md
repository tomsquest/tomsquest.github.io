---
title: "Elasticsearch JS: retry on timeout"
lang: en
image: /assets/images/posts/2025-03-24-elasticsearch-js-retry-on-timeout/retryOnTimeout.png
---

Elasticsearch.js 8.14.0 changes how request timeouts are handled.

Version `8.14.0` of the driver no longer retries timed-out requests by default.  
And it also added exponential backoff for retries.

From the release notes:

> @elastic/js 8.14.0 upgraded to @elastic/transport v8.6.0 which refactored when and how failed requests are retried.
> Timed-out requests are no longer retried by default, and retries now use exponential backoff rather than running immediately.

If you need to enable retries:

```js
await elasticClient.search(
  {
    query: { match_all: {} },
  },
  {
    retryOnTimeout: true, // default is false

    // Other related options:
    // maxRetries: 3,          // default is 3, exponential backoff now-on
    // requestTimeout: 30_000, // default is 30_000
  },
)
```
