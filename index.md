---
layout: page
title: Home
id: home
---

**artoo** is a piece of JavaScript code meant to be run in your browser's console to provide you with some scraping utilites.

**artoo** can therefore be loaded into the JavaScript context of any webpage through a handy bookmarklet you can instantly install by dropping the icon below onto your bookmark bar.

<p align="center">
  <a href='{{ site.bookmarklet }}'>
    <img alt="artoo" width="148" height="148" src="https://raw.githubusercontent.com/medialab/artoo/master/chrome/icons/artoo-icon.svg" />
  </a>
</p>

Just click the freshly created bookmark and **artoo** should greet you within your browser's console and tell you he is ready to roll.

---

But **artoo** is not only a console tool. He can also be used as a framework useful to anyone requiring to perform complex client-side scraping tasks.

He is therefore as fit for your quick & dirty scraping jobs as for more ambitious data heists.

---

## What can bring me the present documentation?
If this is your first visit, you should probably visit the [Quick Start]({{ site.baseurl }}/quick_start) section of this documentation to take a glimpse at what **artoo** can do for you.

If you are searching for more specific documentation or if you are just taking a stroll, the summary located below and the sidebar at your left should be more of use.

---

## Why client-side scraping?

> &laquo; *Why on earth would I scrape client-side? Isn't this insane?* &raquo;

Well, before quitting the present documentation and run back to your beloved scrapy spiders, you should pause for a minute or two and read the reasons why **artoo** has made the choice of client-side scraping.

---

Usually, the scraping process occurs thusly: we find sites from which we need to retrieve data and we consequently build a program whose goal is to fetch those site's html and parse it to get what we need.

The only problem is therefore that nowadays website are not just plain html. We need cookies, we need authentication, we need JavaScript execution etc...

%%%%


d'habitude on voit un site, puis on écrit un programme qui va récupérer le site et le parser. mais avec JavaScript et tout le bordel, c'est devenu plus en plus complexe d'écrire ce prog et si on résume, en gros, un prog de scraping doit faire quoi aujourd'hui pour fonctionner? list --> ca ne vous rappelle rien, on appelle ça un browser

En gros, artoo se sert du browser comme plateforme de scraping. En plus c'est rapide, on peut tester en live, pas de problème de cookie ou d'authentication, moins de chance de se faire tèj comme un robot. Plus peut créer pour les autres un bookmarklet pour end user. ou pour build more ambitious

Mais je ne dit pas que ca va remplacer le scraping classique: pour crawler comme un porc et faire du chiffre, artoo n'est pas fit. Mais que le client-scrape ça peut te changer la vie sur pas mal de cas.

---

## Summary
* Quick Start
* Methods
	* *artoo.autoExpand*
	* *artoo.autoScroll*
	* *artoo.instructions*
	* *artoo.scrape*
	* *artoo.save*
	* *artoo.store*	
* Settings
* Grunt Task

---

## Contribution
[![Build Status](https://travis-ci.org/medialab/artoo.svg)](https://travis-ci.org/medialab/artoo)

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

## Disclaimer
Please note that **artoo** has been built having *Chrome* and *Chromium* in mind. So, even if artoo may function quite properly on other browsers, some of its features such as instructions recording might not be available on those other browsers.

If you think this is injust and find that some features can be ported to other browsers, please report it and we'll find a solution together.

---

## Authors
**artoo** is being developed by [Guillaume Plique](https://github.com/Yomguithereal) for Sciences-Po's [médialab]({{ site.medialab.url }}).

Logo by [Daniele Guido](https://github.com/danieleguido).

---

## License
MIT
