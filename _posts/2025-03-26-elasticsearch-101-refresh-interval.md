---
title: "Elasticsearch 101: refresh interval"
description: "Elasticsearch refresh_interval explained: when indexed documents become searchable, which values to use, and disabling refresh during heavy indexing."
lang: en
locale: en_US
image: /assets/images/posts/2025-03-26-elasticsearch-101-refresh-interval/refresh_interval.png
twitter:
  card: summary
---

A quick guide to the Elasticsearch `refresh_interval` setting.

## What is the refresh interval? 

- Controls how often indexed documents become **searchable**
- Documents are **stored** in all cases, just not **indexed**
- Default is to refresh every second
- Documents are **invisible** to search until refresh occurs
- Refresh is a **background process** making new documents visible

## Values

- Default: 1 second (`1s`)
- Set to `-1` to disable automatic refreshes
- Set to `null` to restore to default settings from the index settings, or the global default of `1s`
- Custom value (e.g. `30s`) for specific workloads

## Typical usage

1. Disable automatic refreshes during heavy indexing by setting it to `-1`
2. Call the `_refresh` API manually when needed (the end of your operation...)