[![Build Status](https://travis-ci.org/medialab/artoo.svg)](https://travis-ci.org/medialab/artoo)

# artoo

## Full documentation
**artoo**'s full documentation is available [here](https://medialab.github.io/artoo).

## Concept
**artoo** is a piece of JavaScript code meant to be run in your browser's console to provide you with some scraping utilites.

**artoo** is loaded into the JavaScript context of any webpage through a handy bookmarklet you can instantly install by dropping the icon below onto your bookmark bar.

<p align="center">
  <a href='javascript: (function(){var t={},o=!0;if("object"==typeof this.artoo)artoo.reload||(artoo.log.verbose("artoo already lies within this page. No need to inject him again."),artoo.loadSettings(t),artoo.hooks.trigger("exec"),o=!1);else if(o){var e=document.getElementsByTagName("body")[0],a=document.createElement("script");console.log("artoo is loading..."),a.src="https://rawgit.com/medialab/artoo/master/build/artoo.min.js",a.type="text/javascript",a.id="artoo_injected_script",a.setAttribute("settings",JSON.stringify(t)),e.appendChild(a)}}).call(this);' id='bookmarklet'>
    <img alt="artoo" width="148" height="148" src="https://medialab.github.io/artoo/public/img/artoo-icon.svg" />
  </a>
</p>

Just click the freshly created bookmark and **artoo** should greet you within your browser's console and tell you he is ready to roll.

---

But **artoo** is not only a console tool. He can also be used as a framework useful to anyone requiring to perform complex client-side scraping tasks.

He is therefore as fit for your quick & dirty scraping jobs as for more ambitious data heists.

---

## Contribution

Contribution are more than welcome. Feel free to submit any pull request as long as you added unit tests if relevant and passed them all.

To install the development environment, clone your fork and use the following commands:

```bash
# Install dependencies
npm install

# Testing
npm test

# Compiling dev & prod bookmarklets
grunt bookmarklets

# Running a test server hosting the concatenated file
npm start

# Running a https server hosting the concatenated file
# Note that you'll need some ssl keys (instructions to come...)
npm run https
```

---

## Authors
**artoo** is being developed by [Guillaume Plique](https://github.com/Yomguithereal) @ SciencesPo - [médialab](http://www.medialab.sciences-po.fr/fr/).

Logo by [Daniele Guido](https://github.com/danieleguido).
