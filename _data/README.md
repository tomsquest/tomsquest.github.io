# _data

## How to generate a list of my projects on github

```shell
gh api "users/tomsquest/repos?per_page=100" --jq '[.[] | select(.owner.type == "User" and .owner.login == "tomsquest" and .fork == false) | {name, description, html_url, stargazers_count, language, private, pushed_at, topics}]'
```