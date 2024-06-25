---
title: "Maximizing Efficiency: A Guide to Caching in Jest, Prettier, ESLint, and TypeScript"
lang: en
---

**Cache all the things!** 
Speed up your development workflow by enabling caching for Jest, Prettier, ESLint, and TypeScript, both locally and in your CI.

## TL;DR

- Set up a `.cache` folder in your project
- Keep Jest's cache across restart, `--cacheDirectory .cache/jest/`
- Enable ESLint's cache `--cache --cache-location .cache/eslint/`
- Enable Prettier's cache `--cache --cache-location .cache/prettier/`
- Enable TypeScript's cache `--incremental`
- CI: store the `.cache` folder across builds

## Cache folder

Store all cache files in a `.cache` folder at your project's root
This folder will be useful to fasten your workflow locally, keep your project clean, and in the CI by storing .cache across builds.

First step, add `.cache` to your `.gitignore`:

```bash
echo ".cache" >> .gitignore
```

## Jest's cache

Jest's cache is **enabled** by default, but it's kept in `/tmp` by default, so not kept across restarts and lost in the CI.

Keep the cache by specifying a cache directory:

```json
{
  "jest": {
    "cacheDirectory": ".cache/jest"
  }
}
```

Alternative on the command line:

```bash
npx jest --cacheDirectory .cache/jest
```

## Eslint's cache

From the [ESLint docs](https://eslint.org/docs/latest/use/command-line-interface#caching):
> `--cache`  
> Store the info about processed files in order to only operate on the changed ones. Enabling this option can dramatically improve ESLint’s run time performance by ensuring that only changed files are linted.

Run ESLint with the cache enabled, and specify the cache location:

```bash
npx eslint --cache --cache-location .cache/eslint/
```

In your CI, you will want to change the cache strategy for `content`. 
The default is `metadata`, which is faster, but the file modification date change in the CI (due to Git clone), and the cache will not be used.

```bash
npm run lint -- --cache --cache-location .cache/eslint/ --cache-strategy content
```

## Prettier's cache

Prettier's cache is **disabled** by default, but you can enable it with `--cache`.
You can also set the location of the cache, and the cache strategy.

```bash
npx prettier --cache --cache-location .cache/prettier/
```

As for ESLint, you can change the cache strategy for `content` in your CI:

```bash
npm run format -- --cache --cache-location .cache/prettier/ --cache-strategy content
```

## Typescript's cache

Typescript uses `.tsbuildinfo` files placed that cannot be placed in `.cache` from what I know.

From the [TypeScript docs](https://www.typescriptlang.org/tsconfig/#incremental):
> `incremental`  
> Tells TypeScript to save information about the project graph from the last compilation to files stored on disk.

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "incremental": true
  }
}
```

## CI

In your CI, you will want to store the `.cache` folder across builds.

This can be achieved easily, using [Magnetikonline's ActionNodeModules cache](https://github.com/magnetikonline/action-node-modules-cache), that will cache `node_modules` and any additional path you specify.

```yaml
- name: Setup Node.js with node_modules cache
  id: node-with-cache
  uses: magnetikonline/action-node-modules-cache@v2
  with:
    node-version-file: .nvmrc
    additional-cache-path: |
      .cache
- name: Install npm packages
  if: steps.node-with-cache.outputs.cache-hit != 'true'
  run: npm ci
```

## Conclusion

By enabling cache for Jest, Prettier, ESLint, and TypeScript, you can speed up your development workflow.
And you can also make your CI faster! 🚀

Alternative tools exist, like [Biome](https://biomejs.dev/), providing format and lint in the same tool, ultra-fast thanks to Rust, but quite limited in terms of linting rules for now.
