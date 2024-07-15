---
title: Better NPM'ing, Tips and Tricks using NPM
lang: en
image: /assets/images/posts/2018-10-02-better-npm-ing/npm_logo.png
---

I discovered several tips for working with NPM on a daily basis. Here are the top ones.

I presented those tips to my coworkers and [the slides are available online](https://tomsquest.github.io/presentation-better-npm-ing/).

## TL;DR 

- Use `save-exact` for consistent installs
- Run `npm ci` for fast and consistent installs
- Run `npm audit fix` to fix security issues, quickly
- Use `npx npm-check -u` or `npx updtr` to update dependencies
- Use `NVM_SYMLINK_CURRENT` to have a symlink to the current node version

## Reproducible builds

**Problem**: your local installation can/will differ from another coworker, even on the CI server!

**Cause**: Version range are problematic: `"rxjs": "^6.2.2"`

[Greenkeeper.io](https://greenkeeper.io) tells us that 15% of packages break the _minor_ or _patch_ updates:

![Greekeeper](/assets/images/posts/2018-10-02-better-npm-ing/greenkeeper.png)

**Solution**: Use `--save-exact` when installing a dependency

```bash
$ npm install --save-exact aDependency
# Shorter:
$ npm i -E aDependency
```

**Better solution**: Always exact, never use a range: `npm config set save-exact true`

```bash
$ npm config set save-exact true
```

## Installing package

**Problem**: Using `npm install` will try to resolve the dependency graph, possibly installing different versions (because of ranges declared in dependencies, not yours even if you used `--save-exact`) and then updating the `package-lock.json` even if you did not want to.

**Solution**: Use `npm ci` which only read the `package-lock.json`

↗ Speed (on CI and locally)

➕ Avoid dirty-ing the `package-lock.json`

```bash
$ npm ci
```

## Global package

**Problem**: Polluting the global `node_modules` with global packages: nest-cli, create-react-apps (= hundreds of packages)

**Solution**: `npx` runs a package without installing it (but first, tries to find it locally in `node_modules`)

```bash
# Example with params given to cleaver
$ npx cleaver watch index.md
```

## Security

**Problem**: Finding packages with security flaws

**Solution**: Use the builtin `npm audit` and `npm audit fix`

➕ Fails the build given integrated it in CI

Another solution is to use the builtin services of GitHub and Gitlab.

```bash
$ npm audit fix
```

## Updating packages

**Problem**: Updating dependency and finding the one that breaks the code is tedious.

**Solution 1 (best)**: [updtr](https://www.npmjs.com/package/updtr) update one dependency, then run the tests, then repeat

```bash
$ npx updtr
```

**Solution 2**: [npm-check](https://www.npmjs.com/package/npm-check) show a pretty menu of all updates

```bash
$ npx npm-check -u
```

![npx npm-check -u](/assets/images/posts/2018-10-02-better-npm-ing/npm-check-u.png)

## Current Node version in Tools

**Problem**: When configuring Node/Typescript, the node **path** is version-dependent

![List of node version from Intellij](/assets/images/posts/2018-10-02-better-npm-ing/nvm_symlink_current.png)

**Solution**: if you use NVM for managing installation of Node.js, NVM can automatically manage a symlink to the current version of node. NVM will link `~/.nvm/current` to, for example, `~/.nvm/versions/node/v11.0.0` and recreate the link when changing of node versions (automatically if you use [NVM auto-use ZSH plugin](https://github.com/tomsquest/nvm-auto-use.zsh)).

```bash
# Put this in your .bashrc/.zshrc
$ export NVM_SYMLINK_CURRENT=true
```

## (Bonus) Follow GitHub Releases

**Problem**: Be notified of releases

**Solution 1**: (_Updated: 2018.12.02_) GitHub now supports watching releases of a repository: [Documentation](https://help.github.com/articles/watching-and-unwatching-releases-for-a-repository/).

**Solution 2**: [Gitpunch.com](https://gitpunch.com) seems to solve the problem. It can follow all your GitHub stars and specific projects.

[![Git Punch](/assets/images/posts/2018-10-02-better-npm-ing/gitpunch.com.png)](https://gitpunch.com)
