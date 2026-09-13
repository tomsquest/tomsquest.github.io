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

### Linting

`books.schema.json` is the JSON Schema of `books.json` (IntelliJ: Settings → Languages &
Frameworks → Schemas and DTDs → JSON Schema Mappings, map `_data/books.json` to it).

```shell
_bin/lint_books          # schema + covers + duplicates + ordering; exit 1 on errors
_bin/lint_books --fix    # also rewrite entries with keys in canonical order
```

## projects.json

How to generate a list of my projects on GitHub:

```shell
gh api "users/tomsquest/repos?per_page=100" --jq '[.[] | select(.owner.type == "User" and .owner.login == "tomsquest" and .fork == false) | {name, description, html_url, stargazers_count, language, private, pushed_at, topics}]'
```
### Adding a book

```shell
_bin/add_book --title "La Traque" --series "Le Puits des Mémoires" --volume 1/3 \
  --author "Gabriel Katz" --rating 4 --date 2026-08 --comment "De l'aventure !" --tinify
```

Finds the cover (Decitre by ISBN, then image search), resizes it to 300px, and inserts the
entry at the top of `books.json`. `--photo file.jpg` takes the reading month from the photo's
EXIF date. See `_bin/add_book --help`. With Claude Code: drop the photos in `_inbox/` (ignored
by git) and run `/add-books`.
