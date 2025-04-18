---
title: "Elasticsearch 101: Shards vs Replicas"
lang: en
image: /assets/images/posts/2025-04-16-elasticsearch-101-shards-vs-replicas/shard_replica.png
---

Understanding the critical difference between Elasticsearch shards and replicas for optimal cluster performance and reliability.

## TL;DR

* Shards: Partitions of data distributed across servers
* Replicas: Copies of shards for redundancy and read performance
* Shards improve write performance (increase parallelism)
* Replicas improve read performance but can slow down writes

## Understanding Shards and Replicas

### Shards
- Horizontal partitions containing unique subsets of documents
- Distributed across multiple nodes to enable horizontal scaling
- Allow parallelization of operations across the cluster

### Replicas
- Exact copies of shards placed on different nodes
- Provide redundancy if a node fails
- Increase read throughput but not write performance

## Performance Implications

**Common misconception**: Replicas don't help with write performance like sharding does.   
In fact, replication can slow down writes, as Elasticsearch has to wait for replication to complete.

## Production Best Practices

✅ Our recommendations:
- Maintain 2 replicas of each index (3 copies total) across at least 3 nodes (always minimum of 3 nodes in production)
- Follow Elastic's guidelines: shard size between 10-50GB and <200M docs
- Don't over-shard small indices (unnecessary overhead)

See Elastic's doc on [Sharding](https://www.elastic.co/docs/deploy-manage/production-guidance/optimize-performance/size-shards#general-sizing-guidelines) for more detailed guidance.