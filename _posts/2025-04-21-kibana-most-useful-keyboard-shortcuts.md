---
title: "Kibana most useful keyboard shortcuts"
description: "The Kibana Dev Tools keyboard shortcuts I use most: run a request, move between requests, auto-indent, and open the relevant documentation."
lang: en
image: /assets/images/posts/2025-04-21-kibana-most-useful-keyboard-shortcuts/kibana_shortcuts.png
twitter:
  card: summary
---

My most used keyboard shortcuts for Kibana. Yes, Kibana has keyboard shortcuts! 🚀

## TL;DR

- ⌨️ Ctrl/Cmd + Enter → Execute current request
- ⌨️ Ctrl/Cmd + ↑ (and ↓) → Go to the previous (or next) request
- ⌨️ Ctrl/Cmd + I → Auto-indent current request
- ⌨️ Ctrl/Cmd + / → Open relevant documentation

## 1. Run the current request

This well-known shortcut is essential for productivity, yet many still reach for their mouse.   

Similar to BigQuery console and other development tools.

⌨️ **Control/Cmd + Enter** → Execute your current request

## 2. Move between requests

Easy ones:

⌨️ **Control/Cmd + ↑ (and ↓)** → Go to the previous (or next) request

## 3. Fix indentation in your request

Perfect for when you paste JSON that comes in misformatted. 

While it won't fix invalid JSON syntax, it instantly fixes indentation issues.

⌨️ **Control/Cmd + I** → Auto-indent

Note: This doesn't fix malformed JSON, but that's a feature opportunity for AI integration! (I should do a PR for that!)

## 4. Access documentation

This shortcut quickly opens documentation relevant to your query. 

While helpful, it has limitations because it currently opens general documentation for the query type (`_search`) rather than the specific type (`match_phrase`).

⌨️ **Control/Cmd + / (slash)** → Open documentation

## Reference

- [Official Kibana doc on Keyboard shortcuts](https://www.elastic.co/guide/en/kibana/current/keyboard-shortcuts.html)