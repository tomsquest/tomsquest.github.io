---
title: "Maven in colors"
slug: maven-in-colors
date: 2013-09-30T00:00:00Z
---

<img src="/assets/images/posts/2013/maven-logo.png" style="float:right"/>

_Updated the 2014.01.21 - Added JCGay Maven Agent_

Maven output is quite pale. Want to see some green for successes, red for failures and yellow for warnings ?
Let's see how to do it.

This post is an enhanced version of several shell scripts (like this [one](https://github.com/builddoctor/maven-antsy-color)) 
or Arnaud Heritier's log4j2 approach : [United Colors of Maven](http://aheritier.net/united-colors-of-maven/).

## How it looks

Here is a screenshot of a successful build :

![Maven successful build with colors](/assets/images/posts/2013/maven-colors-success.png)

Screenshot of a failed build :

![Maven failed build with colors](/assets/images/posts/2013/maven-colors-failure.png)

## Preferred solution : shell function

My preferred solution is to pipe Maven's output to __sed__ and to insert Ansi color sequences at the correct locations. 
It is done like this :

```bash
mvn $goal | sed -e '/BUILD SUCCESS/$red BUILD SUCCESS/'
```

In reality, it is a bit more complex because we want to return the exit code of the maven command 
and not the one of sed or the other chained command.

The shell function (zsh and bash compatible) is available at : 
https://github.com/tomsquest/dotfiles/blob/master/zsh/functions/mvn-in-colors.zsh

You just have to put this file somewhere, source it and make an alias to mvn :

```bash
$ source mvn-in-colors.zsh
$ alias mvn=mvn-in-colors # done !
```

### Restrictions

Using this method does not work when Maven asks for input, for example when using the release:prepare goal.

Workaround :

* Ignore the alias with `\mvn` when releasing
* Don't use the release plugin and prefer the solution of Axel Fontaine :
[Maven Release Plugin: The Final Nail in the Coffin](http://axelfontaine.com/blog/final-nail.html)

## Maven Agent

Jean-Christophe Gay wrote an interesting bit of code to handle the problem : a Java agent to hack Maven logging.

The code is here : [Maven Color on GitHub](https://github.com/jcgay/maven-color)

### Restrictions

The Readme says the agent will fail when using a plugin using itself a different version of ASM (use to change the bytecode).
See the [Known issues](https://github.com/jcgay/maven-color#known-issues).

## Rainbow

[Rainbow](https://github.com/nicoulaj/rainbow) is a colorizer of commands outputs written in Python.
It uses patterns to match strings to colors.

And __Rainbow supports Maven out of the box__!

Once installed, running Rainbow is as simple as :

```bash
$ rainbow --config=mvn3 -- mvn clean install
```

### Restrictions

The original Rainbow version does not return the exit code of the specified program (mvn in our case).
This is real problem when you want to chain mvn with a push. ie.

```bash
$ rainbow --config=mvn3 -- mvn clean install && git push # will push even if the build failed !
```
Some works try to fix the issues of rainbow. The [one from GfxMonk](https://github.com/gfxmonk/rainbow) seems to fix the lack of exit code.
