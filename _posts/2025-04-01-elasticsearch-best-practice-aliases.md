---
title: "Elasticsearch best practice: aliases"
lang: en
image: /assets/images/posts/2025-04-01-elasticsearch-best-practice-aliases/aliases.png
---

Elasticsearch aliases are a best practice. They simplify alot management of indices, for example, migration between indices.

## TL;DR

- An alias is simply a secondary name for an index or a set of indices
- Switch underlying indices without changing application code
- Switches are atomic = no zero downtime

## Tips

- Use the alias in application code (`my_index`) and target indices version-based (`my_index_v1`, `my_index_v2`) or time-based (`my_index_2024`, `my_index_2025`)
- List aliases, sorted by name: `GET _cat/aliases?v&s=alias`
- Actions done in a single calls to `POST _aliases` are atomic (all-performed at once)

## Typical usage

Given your app only knows the alias (`my_index`),   
Create a new index (`my_index_v2`) and reindex the old to the new index (`my_index_v1` to `my_index_v2`). 
Then switch the alias when and only if the operation succeeds.  
No change in application code, no downtime.

```
POST _aliases
{
  // Atomic operation (all at once)
  "actions": [
    {
      "add": {
        "index": "my_index_v2",
        "alias": "my_index"
      }
    },
    {
      "remove": {
        "index": "my_index_v1",
        "alias": "my_index"
      }
    }
  ]
}
```
