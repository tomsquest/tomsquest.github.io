---
title: "Elasticsearch best practice: disable dynamic mapping"
lang: en
image: /assets/images/posts/2025-04-04-elasticsearch-best-practice-disable-dynamic-mapping/dynamic_mapping.png
---

Elasticsearch best practice: disable dynamic mapping in your indices, or even reject unmapped fields.

## TL;DR

- Disable dynamic mapping in your indices for better control
- Consider rejecting unmapped fields for stricter validation
- Document your mapping explicitly for maintainability
- i.e. Use `dynamic: false` or `dynamic: strict` based on your requirements

## Why Disable Dynamic Mapping?

Elasticsearch's dynamic mapping automatically adds fields to your index when it encounters new ones. While convenient for quick starts, it can lead to problems in production:

➡️ **Fully documented mapping is a must.**  
= It's best when you know what indices contain and how the fields are indexed.

Dynamic mapping can cause:
- Unexpected field types
- Index bloat with unused fields
- Inconsistent mapping across environments
- Mapping explosion with high cardinality fields

## Tips for Better Mapping

✅ Best practice: use `dynamic: false` and list all fields explicitly
- This prevents new fields from being indexed automatically
- Fields not in the mapping will still be stored in `_source` but won't be searchable
- Add `index: false` to fields you need to store but don't need to search

⭐ For stricter validation: use `dynamic: strict`
- Rejects documents with unmapped fields completely
- Provides stronger schema validation
- Prevents unexpected data from entering your index

## Typical Usage

Setting dynamic mapping at index creation:

```
PUT my_index
{
  "mappings": {
    "dynamic": "false",
    "properties": {
      "title": { "type": "text" },
      "created_at": { "type": "date" },
      "description": { 
        "type": "text", 
        "index": false // field mapped but not indexed
      }
    }
  }
}
```