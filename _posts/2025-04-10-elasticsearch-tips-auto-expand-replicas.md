---
title: "Elasticsearch tips: auto_expand_replicas"
lang: en
image: /assets/images/posts/2025-04-10-elasticsearch-tips-auto-expand-replicas/auto_expand_replicas.png
---

The `auto_expand_replicas` setting in Elasticsearch dynamically adjust replica counts during cluster scaling.

## TL;DR
 
* The `auto_expand_replicas` setting automatically adjusts replica count when nodes change
* Eliminates manual replica management during cluster scaling
* Set to `0-all` for replicas on all available data nodes
* Use custom ranges like `0-2` for controlled replication

## How we use it

Auto-expand replicas solves this by dynamically adjusting replicas based on cluster size.

⭐ We use this in our performance environment after scaling operations to get the appropriate number of replicas.

Because it happened, we forgot to increase the number of replicas after scaling up the cluster! 😫

## Typical Usage

```
PUT my_index
{
  "settings": {
    "auto_expand_replicas": "0-all"
  }
}
```