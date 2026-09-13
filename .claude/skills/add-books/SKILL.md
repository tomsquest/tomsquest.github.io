---
name: add-books
description: Add books to the bookshelf (_data/books.json) from cover photos. Use when the user shares photos of books they finished, or says "ajoute ce livre / ces livres à ma bibliothèque".
---

# Add books to the bookshelf

The user photographs each book right after finishing it, then sends the photos.
Turn each photo into an entry in `_data/books.json` with a cover, using `_bin/add_book`.

## Workflow

1. **Read every photo** and extract: title, subtitle, series, volume number, authors,
   fiction / non-fiction. For a series, give the volume as `N/total` (`1/3`) or `N/?`
   if the series is still open. Look up the real total when unsure.
   - `title` is the volume title, `series` the series name (e.g. title "La Traque",
     series "Le Puits des Mémoires"). Standalone book: no `series`.
   - Check the list first: `grep -i "<title or author>" _data/books.json`. Earlier volumes
     of a series may be missing — ask whether they were read too.

2. **Ask once for what only the user knows**, in a single grouped message (a table works
   well): rating (1–5), comment (may be empty), reading month (`YYYY-MM`).
   - The user may have given some of it inline ("tout lu en août") — don't re-ask.
   - Reading month: the photo is taken when the book is finished. Photos pasted in chat
     have no EXIF; if the user drops the files in `_inbox/` instead, pass them with
     `--photo` and the month comes from EXIF automatically.
   - Do the cover work (step 3) *before* or *while* waiting; it doesn't depend on the answers.
     Use `--dry-run` to validate cover lookup early, then run for real once answers arrive.

3. **Run `_bin/add_book` once per book** (needs `uv`; deps are inline). Newest book last,
   because each entry is inserted at the top of the list.
   ```bash
   _bin/add_book --title "Le Fils de la Lune" --series "Le Puits des Mémoires" --volume 2/3 \
     --author "Gabriel Katz" --rating 4 --date 2026-08 --comment "..." --tinify
   ```
   - Non-fiction: `--non-fiction`. Audiobook: `--format audiobook`.
   - `--tinify` compresses with TinyPNG (`TINIFY_APIKEY` comes from `.envrc`; run through
     `direnv exec . _bin/add_book ...` if the variable is not in the environment).
   - The script prints the cover source and size: **look at the saved cover** (Read the
     file) and make sure it's the right book, the right volume, and a French edition
     when one exists. Wrong cover → delete the file and re-run with `--cover-url` or
     `--isbn`. Cover lookup order is ISBN via decitre.fr, then DuckDuckGo images.
   - No cover found anywhere → `--cover-file <photo>` with the user's photo, cropped.

4. **Check** the result: `python3 -c 'import json; json.load(open("_data/books.json"))'`,
   every new entry has `cover`, the file exists, and covers are 300 px wide.

5. **Do not run `_bin/sort_books`** unless asked: it re-orders alphabetically within a
   month, and the user prefers reading order (newest first).

6. **Commit** only when the user asks, on `master`, message style:
   `feat(bookshelf): add august and september books` / `feat(bookshelf): add <title>`.
   Push only when asked.

## Conventions (see also `_data/README.md`)

- Field order in an entry: title, subtitle, series, authors, rating, volume, comment,
  date, urls, fiction, cover, format. The script follows it.
- Cover file: `assets/books/<slug>.jpg`, slug = series + volume number
  (`wayward-pines-2.jpg`) or title (`travail.jpg`). 300 px wide, JPEG quality ~75–80.
- Rating scale: 5 outstanding · 4 really enjoyed · 3 good not great · 2 lost my time · 1 avoid.
- Comments are in French, short and personal; keep the user's wording as-is.
