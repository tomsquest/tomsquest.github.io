---
title: Think carbon, reduce typescript bundle size
lang: en
---

Reducing the size of JS compiled from Typescript is easy.

Here are some numbers and how to do it. It's nearly free if you run on Node (!= browser).

**TL;DR**: enable tslib/importHelpers, reduce the size of the JS files, reduce storage and network, **think carbon**!

## Size matters

Sizes after and before, with the difference in percent:

|                     |     Before |      After | Diff |
| ------------------- | ---------: | ---------: | ---: |
| line count \*.js    | 4397 lines | 4011 lines |  -9% |
| size in bytes \*.js |       186k |       153k | -18% |

## How-to

[Install tslib](https://github.com/microsoft/tslib), the library that contains the helper code:

```bash
npm i tslib
```

Enable the import of the helper functions:

```json
{
  "compilerOptions": {
    "importHelpers": true
  }
}
```

## What does it do

Typescript will create helper functions for decorators, extends, assign, etc. in each compiled file.

But, Typescript can use a reference library, [tslib](https://github.com/microsoft/tslib) and import the functions from there.

Sample of generated code without tslib/importHelpers:

```js
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
```

With tslib/importHelpers:

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
```

## Measuring

I measured the size before and after with the following commands:

```bash
# don't forget to do a clean-build
# npm run clean && npm run build

# count lines
( find ./dist -name '*.js' -print0 | xargs -0 cat ) | wc -l

# total size in bytes
{ find dist -type f -name "*.js" -printf "%s+"; echo 0; } | bc
```
