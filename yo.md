---
layout: page
title: Yeoman Generator
id: yo
---

# {{ page.title }}

---

To simplify the development of **artoo.js** bookmarklets, a simple [Yeoman](http://yeoman.io/) generator has been created to enable you to start working on what is really important rather than spending hours writing boilerplate code.

---

## Installation

```bash
[sudo] npm install -g yo generator-artoo
```

---

## Usage

As with any Yeoman generator, create a directory in which you will scaffold the needed files, enter it and launch the generator.

```bash
mkdir my-project
cd my-project
yo artoo
```

The generator will ask you a series of four questions:

* What is the name of your project?
* How would you describe your project
* What kind of bookmarklet do you need to build?
* Do you need https support?

---

## Commands

Every type of bookmark scaffolded comes with a `gulp` environment for you to work easily.

You can therefore use the following commands:

```bash
# Lint and build the files
gulp

# Build only the bookmarklets
gulp bookmarklets

# Run a local server and watch files
npm start

# or
gulp work
```

---

## Workflow

Typically, generated bookmarklet come in two forms: a dev and a prod one. The dev one execute a script from your local server while the prod compile your files within the bookmarklet itself.

When developing, you should use the dev bookmarklet and run `npm start` so your files are watched and served for an optimal working experience.
