from typing import Generator, Any, Union, final

import requests
import slug
from PIL import Image, UnidentifiedImageError
from PIL.ImageFile import ImageFile
from duckduckgo_search import DDGS
from io import BytesIO
from pathlib import Path
import json


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


def get_first_valid_image(urls: list[str]) -> ImageFile:
    for url in urls:
        response = requests.get(url)
        if response.status_code == 200:
            try:
                img = Image.open(BytesIO(response.content))
                return img
            except UnidentifiedImageError:
                pass


def save_image(image: ImageFile, save_directory: Path, name: str) -> Path:
    dest_file = save_directory / f"{name}.jpg"
    image.save(dest_file)
    return dest_file


def make_search_query(book) -> str:
    title = book.get("title")
    authors = book.get("authors", [])

    volume = get_volume(book)
    if volume:
        volume = f"tome {volume}"

    if authors:
        authors = " ".join(authors)

    return f"couverture livre -audiobook {title} {volume} {authors}".strip()


def get_volume(book) -> str:
    volume = book.get("volume", "")
    if volume:
        return volume.split("/")[0]
    return ""


if __name__ == "__main__":
    dest_folder = Path("assets/books")
    dest_folder.mkdir(exist_ok=True)

    # open _data/books.json and for each book, download the cover
    count = 0
    with open("_data/books.json") as f:
        books = json.load(f)
        for book in books:
            # Skip the book if it already has a cover
            if book.get("cover"):
                continue

            search_query = make_search_query(book)
            print(f"Searching for '{search_query}")

            urls = search_images(search_query, max_images=10)
            image = get_first_valid_image(urls)
            filename = slug.slug(f"{book['title']} {get_volume(book)}")

            dest_file = save_image(image, dest_folder, filename)
            print(f"Saved cover to: {dest_file}")

            count += 1
            if count > 5:
                print("Early stop")
                exit(0)
