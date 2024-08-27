#!/usr/bin/env python
import subprocess
from typing import Generator, Any, Union, final

import requests
import slug
from PIL import Image, UnidentifiedImageError
from PIL.ImageFile import ImageFile
from duckduckgo_search import DDGS
from io import BytesIO
from pathlib import Path
import json
import time
import random


def search_images(term: str, max_images=1) -> list[str]:
    search_results = DDGS(headers={"Accept-Encoding": "gzip, deflate, br"}).images(
        keywords=term,
        region="fr-fr",
        type_image="photo",
        layout="Tall",
        max_results=max_images,
    )
    image_urls = [item.get("image") for item in search_results]
    return image_urls


def get_first_valid_image(urls: list[str]) -> Union[ImageFile, None]:
    for url in urls:
        try:
            response = requests.get(url)
        except requests.exceptions.RequestException:
            continue

        if response.status_code == 200:
            try:
                img = Image.open(BytesIO(response.content))
                return img
            except UnidentifiedImageError:
                continue
    return None


def save_image(image: ImageFile, save_directory: Path, name: str) -> Union[Path, None]:
    dest_file = save_directory / f"{name}.jpg"
    try:
        image.save(dest_file)
    except OSError:
        dest_file = save_directory / f"{name}.png"
        try:
            image.save(dest_file)
        except OSError:
            print(f"Could not save image '{name}'")
            return None
    return dest_file


def resize_image(image_path, max_width=300):
    subprocess.run(["mogrify", "-resize", f"{max_width}x", str(image_path)], check=True)


def make_search_query(book) -> str:
    title = book.get("title")
    authors = book.get("authors", [])

    volume = get_volume(book)
    if volume:
        volume = f"tome {volume}"

    if len(authors) > 0:
        authors = " ".join(authors)

    return f"couverture livre -audiobook {title} {volume} {authors}".strip()


def get_volume(book) -> str:
    volume = book.get("volume", "")
    if volume:
        return volume.split("/")[0]
    return ""


def make_slug(book) -> str:
    name = book.get("series", book.get("title"))
    volume = get_volume(book)
    return slug.slug(f"{name} {volume}")


if __name__ == "__main__":
    books_file = "_data/books.json"

    assets_folder = Path("assets/books")
    assets_folder.mkdir(exist_ok=True)

    def do_it(how_many_books=5) -> bool:
        with open(books_file, "r") as f:
            books = json.load(f)

        # check if all books have a cover
        all_have_cover = all(book.get("cover") for book in books)
        if all_have_cover:
            print("All books have a cover. Exiting")
            return False

        count = 0
        for book in books:
            # Skip the book if it already has a cover
            if book.get("cover"):
                continue

            search_query = make_search_query(book)
            print(f"Searching for '{search_query}")

            urls = search_images(search_query, max_images=10)
            image = get_first_valid_image(urls)
            if not image:
                print(f"No valid image for book '{book['title']}'. Continuing")
                continue

            # Store the image
            filename = make_slug(book)
            dest_file = save_image(image, assets_folder, filename)
            if not dest_file:
                print(f"Could not save image for book '{book['title']}'. Continuing")
                continue
            resize_image(dest_file)
            print(f"Saved cover to: {dest_file}")

            # Add the cover path to the book
            book["cover"] = f"/{dest_file}"

            # Wait time between searches to avoid rate limiting
            if count != len(books) - 1:
                print("Waiting a little bit before the next search...")
                time.sleep(1 + 2 * random.random())

            count += 1
            if count >= how_many_books:
                break

        # Persist the updated books
        with open(books_file, "w") as f:
            json.dump(books, f, indent=2, sort_keys=False, ensure_ascii=False)

        return True

    should_continue = True
    while should_continue:
        should_continue = do_it()
        if should_continue:
            print("Continuing with the next batch of books...")
