# _data

## books.json

Structure with all fields in correct order:

```json
  {
    "title": "",
    "subtitle": "",
    "series": "",
    "authors": [],
    "rating": 4,
    "volume": "7/9",
    "comment": "",
    "date": "2024-08",
    "urls": [],
    "fiction": true
  },
```

## projects.json

How to generate a list of my projects on GitHub:

```shell
gh api "users/tomsquest/repos?per_page=100" --jq '[.[] | select(.owner.type == "User" and .owner.login == "tomsquest" and .fork == false) | {name, description, html_url, stargazers_count, language, private, pushed_at, topics}]'
```