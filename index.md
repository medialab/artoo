---
layout: page
title: Home
id: home
---

<br>

<p align="center">
  <a href='{{ site.bookmarklets.artoo }}' id='bookmarklet'>
    <img alt="artoo" width="220" height="220" src="{{ site.baseurl }}/public/img/artoo-icon.svg" />
  </a>
</p>

---

**artoo** is a piece of JavaScript code meant to be run in your browser's console to provide you with some scraping utilites.

**artoo** is loaded into the JavaScript context of any webpage through a handy bookmarklet you can instantly install by dropping the icon above onto your bookmark bar.

---

<h2>Bootcamp</h2>

Now that you have installed **artoo** let's scrape the famous *Hacker News* in four painless steps:

<ol>
  <li>Copy the following instruction.</li>
</ol>

```js
artoo.scrape('td.title:has(a):not(:last)', {
  title: {sel: 'a'},
  url: {sel: 'a', attr: 'href'}
}, artoo.savePrettyJson);
```

<ol start="2">
  <li>Go to <a href="https://news.ycombinator.com/" target="_blank">Hacker News</a>.</li>
  <li>Open your JavaScript console and click the freshly created bookmarklet (<strong>artoo</strong> should greet you and tell you he is ready to roll).</li>
  <li>Paste the instruction and hit enter.</li>
</ol>

That's it. You've just scraped *Hacker News* front page and downloaded the data as a pretty-printed json file&#42;.

&#42; <small>If you need a more thorough scraper, check [this]({{ site.baseurl }}/hacker_news) out.</small>

---

<h2 id="features">Features</h2>
<br>

* **Scrape everything, everywhere**: invoke artoo in the JavaScript console of your browser in any web page.
* **Scraping helpers**: Scrape data quick & easy with powerful helpers such as [artoo.scrape]({{ site.baseurl }}/scrape).
* **Data download**: Make your browser download the scraped data with [artoo.save]({{ site.baseurl }}/save) methods.
* **Spiders**: Crawl pages through ajax and retrieve accumulated data with artoo's [spiders]({{ site.baseurl}}/spiders).
* **Content expansion**: Expand pages' content programmatically thanks to [artoo.autoExpand]({{ site.baseurl }}/expand) utilites.
* **Store**: stash persistent data in the localStorage through artoo's handy [abstraction]({{ site.baseurl }}/store).
* **Instructions**: record the [instructions]({{ site.baseurl }}/instructions) typed into the console and save them for later use.
* **jQuery**: [jQuery]({{ site.baseurl }}/jquery) is injected alongside artoo in the pages you visit so you can walk handle the DOM easily.
* **Custom bookmarklets**: you can use artoo as a framework and easily create custom bookmarklets to execute your code.
* **Chrome extension**: trying to scrape a nasty page abiding by some sneaky HTML5 rules? Here, have a [chrome extension]({{ site.baseurl }}/chrome).

---

<h2 id="philosophy">Philosophy</h2>
> &laquo; *Why on earth should I scrape on my browser? Isn't this insane?* &raquo;

Well, before quitting the present documentation and run back to your beloved scrapy<sup><small>&copy;</small></sup> spiders, you should pause for a minute or two and read the reasons why **artoo** has made the choice of client-side scraping.

---

Usually, the scraping process occurs thusly: we find sites from which we need to retrieve data and we consequently build a program whose goal is to fetch those site's html and parse it to get what we need.

The only problem with this process is that, nowadays, websites are not just plain html. We need cookies, we need authentication, we need JavaScript execution and a million other things to get proper data.

So, by the days, to cope with this harsh reality, our scraping program became complex monsters being able to execute JavaScript, authenticating on websites and even trying to lead servers into thinking they were human by clicking and browsing naturally.

But, if you sit back and try to find other programs able to perform all those things, you'll quickly come to this observation:

Aren't we trying to rebuild **web browsers**?

---

So why shouldn't we take advantage of this and start scraping with web browsers? It has become really easy today to execute JavaScript in a
a browser's console and this is exactly what **artoo** is doing.

Using browsers as scraping platforms comes with a lot of advantages:

* **Fast coding**: You can prototype your code live thanks to JavaScript browsers' REPL and peruse the DOM with tools specifically built for web development.
* **No more authentication issues**: No longer need to deploy clever solutions to enable your spiders to authenticate on the website you intent to scrape. You are already authenticated on your browser as a human being.
* **Tools for non-devs**: You can easily design tools for non-dev people. One could easily build an application with a UI on top of **artoo**. Moreover, **artoo** gives you the possibility to create bookmarklets on the fly to execute your personnal scripts.

---

The intention here is not at all to say that classical scraping is obsolete but rather that client-side scraping is a possibility today and, what's more, a useful one.

You'll never find yourself crawling pages massively etc. on a browser, but for most of your scraping tasks, client-side should enhance your productivity dramatically.


---

<h2 id="disclaimer">Disclaimer</h2>
Please note that **artoo** has been built having *Chrome* and *Chromium* in mind. So, even if artoo may function quite properly on other browsers, some of its features such as [instructions recording]({{ site.baseurl }}/instructions) might not be available on those.

If you think this is injust and feel that some features can be ported to other browsers, please report it and we'll find a solution together.

---

<h2 id="contribution">Contribution</h2>
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

<h2 id="authors">Authors</h2>
**artoo** is being developed by [Guillaume Plique](https://github.com/Yomguithereal) @ SciencesPo - [médialab]({{ site.medialab.url }}).

Logo by [Daniele Guido](https://github.com/danieleguido).
