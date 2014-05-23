---
layout: page
title: Home
id: home
---

**artoo** is a piece of JavaScript code meant to be run in your browser's console to provide you with some scraping utilites.

**artoo** is loaded into the JavaScript context of any webpage through a handy bookmarklet you can instantly install by dropping the icon below onto your bookmark bar.

<p align="center">
  <a href='{{ site.bookmarklet }}'>
    <img alt="artoo" width="148" height="148" src="{{ site.baseurl }}/public/img/artoo-icon.svg" />
  </a>
</p>

Just click the freshly created bookmark and **artoo** should greet you within your browser's console and tell you he is ready to roll.

---

But **artoo** is not only a console tool. He can also be used as a framework useful to anyone requiring to perform complex client-side scraping tasks.

He is therefore as fit for your quick & dirty scraping jobs as for more ambitious data heists.

---

## Where should I go?
If this is your first visit, you should probably visit the [Quick Start]({{ site.baseurl }}/quick_start) section of this documentation to take a glimpse at what **artoo** can do for you.

If you are searching for more specific documentation or if you are just taking a stroll, the [methods]({{ site.baseurl }}/methods) compendium and the sidebar located at your left should be more of use.

If what you need is documentation about the artoo grunt task, [there]({{ site.baseurl }}/grunt) you go.

---

## Why client-side scraping?

> &laquo; *Why on earth would I scrape client-side? Isn't this insane?* &raquo;

Well, before quitting the present documentation and run back to your beloved scrapy spiders, you should pause for a minute or two and read the reasons why **artoo** has made the choice of client-side scraping.

---

Usually, the scraping process occurs thusly: we find sites from which we need to retrieve data and we consequently build a program whose goal is to fetch those site's html and parse it to get what we need.

The only problem with this process is that, nowadays, websites are not just plain html. We need cookies, we need authentication, we need JavaScript execution and a million other things to get proper data.

So, by the days, to cope with this harsh reality, our scraping program became complex monsters being able to execute JavaScript, authenticating on websites and even trying to lead servers into thinking they were human by clicking and browsing naturally.

But, if you sit back and try to find other programs able to perform all those things, you'll quickly come to this observation:

Isn't this the definition of a **Web browser**?

---

So why shouldn't we take advantage of this and start scraping with web browsers? It has become really easy today to execute JavaScript in browsers' console and this is exactly what **artoo** is doing.

Using browsers as scraping platforms come with a lot of advantages:

* **Fast coding**: You can see and test the result of your code live thanks to JavaScript browsers' REPL and interact with DOM with useful interfaces.
* **No more authentication issues**: No longer need to deploy clever solutions to enable your spiders to authenticate on the website you intent to scrape. You are already authenticated on your browser. Nor more trying to be recognized as a human being: you are a human being.
* **Tools for non-devs**: You can design tools for non-dev people. One could easily build an application with a UI on top of **artoo**. Moreover, **artoo** gives you the possibility to create bookmarklets on the fly to execute your personnal scripts.

---

The intention here is not at all to say that classical scraping is obsolete but rather to say that client-side scraping is a possibility today and, what's more, a useful one.

You'll never find yourself crawling pages massively etc. on a browser, but for most of your scraping tasks, client-side should enhance your productivity dramatically.


---

## Disclaimer
Please note that **artoo** has been built having *Chrome* and *Chromium* in mind. So, even if artoo may function quite properly on other browsers, some of its features such as [instructions recording]({{ site.baseurl }}/instructions) might not be available on those.

If you think this is injust and feel that some features can be ported to other browsers, please report it and we'll find a solution together.

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

## Authors
**artoo** is being developed by [Guillaume Plique](https://github.com/Yomguithereal) @ SciencesPo - [médialab]({{ site.medialab.url }}).

Logo by [Daniele Guido](https://github.com/danieleguido).

---

## License
The MIT License (MIT)

Copyright (c) 2014 Guillaume Plique, Sciences-po médialab

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
