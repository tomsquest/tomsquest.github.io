---
title: "Kibana _cat API tips for Elasticsearch"
lang: en
image: /assets/images/posts/2025-04-25-kibana-_cat-api-tips-for-elasticsearch/kibana_cat_apis.png
---

Simple **_cat API** tips that will make working with Elasticsearch in Kibana easier.

## TL;DR

* `v` (verbose) displays column headers for all _cat APIs
* `s=field` sorts output by the specified column, `s=field:desc` for descending
* `h=field1,field2` to display specific columns
* Combine them: `?v&s=field1&h=field1,field2`

## Example

Stop guessing what each column means with `v` (verbose).  
Sort the output with `s=field` to make it more readable.  

Output:
```
GET _cat/indices/my-app*?v&s=index

health status index                uuid                   pri rep docs.count docs.deleted store.size pri.store.size dataset.size
green  open   my-app-2025.04.15    ZYe2TuLnTGOJrWnlwK3w2A   1   1      14576            0      7.8mb          3.9mb        3.9mb   
green  open   my-app-2025.04.16    39cQj19gTa28hkYNMr9syQ   1   1      28347            0     15.1mb          7.5mb        7.5mb
```

Even more, as [Rolf de Vries](https://www.linkedin.com/in/rolfdevries1984/) pointed out:

> For those who want to save keystrokes: you can do `s=i` as well to sort on the index name

## More: custom columns, sort descending

Use `h=field1,field2` to specify which columns to display.

```
GET _cat/indices/my-app*?v&s=index&h=health,index
```

Use `s=field:desc` to sort in descending order.

```
GET _cat/indices/my-app*?v&s=index:desc
```

## Fun Fact

➡️ Do you know what "CAT" means in the `_cat` API?

It stands for **"Compact and Aligned Text."** 

Why? Because those _cat APIs are specifically designed for human readability in the Kibana console, formatted to be easy on the eyes and to present information in an organized, tabular format. I never knew that, or forgot (my old age 😫)!

From the doc:
> JSON is great... for computers. Even if it’s pretty-printed, trying to find relationships in the data is tedious. Human eyes, especially when looking at a terminal, need compact and aligned text. The compact and aligned text (CAT) APIs aim to meet this need.

## Reference

- [Elasticsearch _cat API documentation](https://www.elastic.co/guide/en/elasticsearch/reference/8.18/cat.html).  
  (weird, the [new documentation site](https://www.elastic.co/docs/api/doc/elasticsearch/group/endpoint-cat) for Elastic 9 does not show the common parameters! I have submitted an issue)
