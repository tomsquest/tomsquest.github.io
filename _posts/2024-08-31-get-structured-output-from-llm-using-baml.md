---
title: "Get structured output from a Language Model using BAML"
---

What if your LLM produces invalid JSON, and worse, JSON that does not respect your schema? 
Let us dig into [BAML](https://github.com/BoundaryML/baml), a tool to solve that, and more!

## TL;DR

- LLMs are not consistent at producing JSON, but getting better at this
- Multiple solutions: function calling, GPT4o strict mode, JSON repair & JSON schema, or everything at once: BAML
- [BAML](https://github.com/BoundaryML/baml) solves the problem and more: retries, cascading between LLM, compatible with multiple LLM, multiple languages, a prompt workbench...

## The problem

In August, my **Quest** was to convert my list of books from a text file to `JSON` to give it a better structure, and to eventually publish it (see [Bookshelf](/bookshelf/)).

A typical note about a book looked like this:

```
Awesome book - Author
Read on august 24
Rating: 4
A good read, but dumb ending
https://book.com/awesome
```

Or worse:

```
Garrett - 6 - Glen Cook
```

(which means I read the volume 6 of the series "Garrett" by Glen Cook)

I expected a JSON like this:

```json
{
  "title": "Awesome book",
  "author": "Authon",
  "read_date": "2024-08-24",
  "rating": 4,
  "comment": "A good read, bad ending",
  "url": "https://book.com/awesome"
}
```

Easy, right?

But:
1. My notes are far from being consistent: multiple date format, no or inconsistent series, many authors, no rating, multiline comments, a description...
2. LLM failed sometimes to produce a valid JSON or do not respect the given schema (I am looking at you Gemini 😡)

As invalid JSON, I got: 
- Some wrong syntax: `"field": wrong`
- Collapsed fields: `"field": "wrong" "field2": "wrong2"`
- New unknown fields (even with a temperature of 0)
- Missing fields
- Unknown fields
- Wrong types: `"rating": "4"` (string instead of int), `volume: 1` (int instead of string)...

## A solution: give a schema, and hope for the best

If you just want to repair the "string" (the JSON string), you can use [json_repair](https://github.com/mangiucugna/json_repair/) in Python.

Something like:

```python
from json_repair import repair_json

good_json_string = repair_json(bad_json_string)
```

But if you want to respect a structure, you need to give the LLM a schema, usually in the form of a JSON schema.

Have a look at this article from Pydantic: "[Steering Large Language Models with Pydantic](https://pydantic.dev/articles/llm-intro)".

And/Or you need something like [Pydantic Partial JSON Parsing](https://docs.pydantic.dev/latest/concepts/json/#partial-json-parsing) to validate it.

```python
from pydantic_core import from_json

partial_json_data = '["aa", "bb", "c'  

result = from_json(partial_json_data, allow_partial=True)
#> ['aa', 'bb']
```

Still, you need to connect to the LLM, and maybe you will need some retry strategy, or better you use a light and cheap model, and if it fails, you then use a more powerful one. 

I discovered [BAML](https://github.com/BoundaryML/baml), a tool to solve this problem.

## The solution: BAML

The [documentation of BAML](https://docs.boundaryml.com/) is quite clear.  
I just want to give an overview of what I did using the tool.

### Prompt workbench

The quest starts with the [workbench at PromptFiddle](https://www.promptfiddle.com/extract-book-info-xFZSd).

![promptfilddle.jpg](/assets/images/posts/2024-08-31-get-structured-output-from-llm-using-baml/promptfilddle.jpg)

The workbench is an editor where you write your prompt and tests, and see the results, using the LLM of your choice.

By the way, BoundaryML provides a free way to use models like Gpt4, Claude...!

You can have a look at my prompt and run the test cases:  
<https://www.promptfiddle.com/extract-book-info-xFZSd>

A baml file consists of:
- a structure that will define what the LLM should output
- a prompt in a "function" that will give the LLM the context and the data to process
- some test cases to validate the output in the workbench

And another file, `clients.baml`, that defines which available LLMs you can use. 

Example (shorten for clarity):

{% raw %}
```
class Book {
  title string
  authors string[]
  rating int?
  date string? @description("format as yyyy-mm if possible")
}

function ExtractBook(book_text: string) -> Book {
  client ClaudeHaiku // define which client to use here

  prompt #"
    Your task is to extract structured information from the book and format it as JSON.

    Book:
    ---
    {{ book_text }}
    ---

    {# special macro to print the output instructions. #}
    {{ ctx.output_format }}

    JSON:
  "#
}

test Test_complete {
  functions [ExtractBook]
  args {
    book_text #"
      Les feux de Cibola - The Expanse - Tome 4/7 - James S.A. Corey
      Lu en avril 2024
      4 sur 5
      Je prends assez de plaisir à lire la suite de l'évolution du monde de The Expanse.
      Le héros est un peu comme Harry Potter, mais ca passe.
      [Roubaix](http://www.mediathequederoubaix.fr/ark:/245243523452)
      [Amazon](https://www.amazon.fr/Quality-Land-Marc-Uwe-Kling/dp/13414321)
    "#
  }
}

test Test_mini {
  functions [ExtractBook]
  args {
    book_text #"
      Garrett - Glen Cook
    "#
  }
}
```
{% endraw %}

**Remark**: No JSON schema here, because from what I get, it consumes lots of tokens, while not being more efficient, thus not producing better results.

### Generating a client

In your project, you store the `baml` files, and you can generate a client using the `baml` command line tool.

BAML can generate clients in Python, Typescript, and Ruby currently.

Typically:

```bash
# files in baml_src 
book.baml
clients.baml
generators.baml
```

Then generate the actual code, here in Python:

```bash
$ baml-cli generate
```

You get a `baml_client` directory.

### Usage

From the `baml_client` directory, you can use the generated code to extract the information from the LLM.

```python
from baml_client.types import Book

book = extract_book(book_text)
```

Tips: if you want to specify the model to use at runtime, you can use the `ClientRegistry`:

```python
from baml_py.baml_py import ClientRegistry
from baml_client import b
from baml_client.types import Book


class Model(str, Enum):
    ClaudeHaiku = "ClaudeHaiku"
    ClaudeSonnet = "ClaudeSonnet"
    GeminiFlash = "GeminiFlash"
    GeminiPro = "GeminiPro"


def extract_book(book_text: str, model: Model) -> Book:
    client_registry = ClientRegistry()
    client_registry.set_primary(model)
    book = b.ExtractBook(book_text, {"client_registry": client_registry})
    return book
```

### LLM config, Retry, failover

I set the `temperature` to `0` in the `clients.baml` file, to get a deterministic output.

Bonus: you can specify a retry strategy, and a failover strategy, in the `clients.baml` file.

Here is what I used (I added a retry due to a network error when calling Anthropic, this happened once):

```
retry_policy RetryTwice {
  max_retries 2
}

client<llm> ClaudeHaiku {
  provider anthropic
  retry_policy RetryTwice
  options {
    model claude-3-haiku-20240307
    api_key env.ANTHROPIC_API_KEY
    temperature 0
    max_tokens 1000
  }
}
```

### Conclusion

A really good experience with BAML!  

**Quest** for a structured output from a LLM: achieved ✅    
**Quest** for converting my books to JSON: achieved ✅  

You can have a look at my [Bookshelf](/bookshelf/) page for the result.