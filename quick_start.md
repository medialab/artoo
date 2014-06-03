---
layout: page
title: Quick start
id: quick_start
---

# Quick start

**artoo** is a client-side scraping companion. He can be invoked within any web page and gives you access to a bunch of useful functions aiming at making your scraping jobs as easy as a stroll in a park.

---

<h2 id="installation">Installation</h2>
Before anything, we need to install **artoo**. Hopefully, this is a painless task: just drop the icon below onto your bookmark bar.

<p align="center">
  <a href='{{ site.bookmarklet }}'>
    <img alt="artoo" width="148" height="148" src="{{ site.baseurl }}/public/img/artoo-icon.svg" />
  </a>
</p>

If you have trouble dropping it, just right click the icon, copy the link address and create a new bookmark you will call artoo and paste the url.

Now that we are ready, let's scrape!

---

* [How can artoo help me with a basic list?](#basic-list)
* [Needing more specific things?](#specific-things)
* [A more complex list](#more-complex-list)
* [Downloading your list](#downloading-list)
* [Remember, remember](#remember)
* [What next?](#what-next)

---

<h2 id="basic-list">How can artoo help me with a basic list?</h2>
Let's consider the following list:

<ul class="url-list">
  <li>
    <a href="#http://nicesite.com">Nice site</a>
  </li>
  <li>
    <a href="#http://awesomesite.com">Awesome site</a>
  </li>
  <li>
    <a href="#http://prettysite.com">Pretty site</a>
  </li>
  <li>
    <a href="#http://unknownsite.com">Unknown site</a>
  </li>
</ul>

It would be a shame if someone were to scrape it...

---

To do so, open your browser's console and click artoo's bookmark. He should now greet you with unmitigated joy.

You are now ready to scrape!

If you open your html inspector, you'll quickly notice that the list we need to scrape is thusly expressed:

```html
<ul class="url-list">
  <li>
    <a href="#http://nicesite.com">Nice site</a>
  </li>
  <li>
    <a href="#http://awesomesite.com">Awesome site</a>
  </li>
  <li>
    <a href="#http://prettysite.com">Pretty site</a>
  </li>
  <li>
    <a href="#http://unknownsite.com">Unknown site</a>
  </li>
</ul>
```

Fortunately, **artoo** is a clever droid and can easily scrape this list for you. He just needs the correct instructions that you are going to provide him by entering the following command into your console.

```js
var niceList = artoo.scrape('.url-list a', {
  url: 'href',
  title: 'text'
});
```

At this point, if you enter `niceList` in your console, it should output an array looking just like this.

```js
[
  {
    url: '#http://nicesite.com',
    title: 'Nice site'
  },
  {
    url: '#http://awesomesite.com',
    title: 'Awesome site'
  },
  {
    url: '#http://prettysite.com',
    title: 'Pretty site'
  },
  {
    url: '#http://unknownsite.com',
    title: 'Unknown site'
  }
]
```

Pretty straightforward, no?


---

<h2 id="complex-things">Needing more specific things?</h2>
Well even if the precedent example is quite nice, you might need to do more specific things.

It would be nice, for starters, to be able to use jQuery. DOM parsing is way more convenient with jQuery sometimes and every scraping guy cherish this kind of convenience.

But, to be really honest with you, **artoo** already injected jQuery for you. He even did it carefully as it would be a pity to break anything within the page you are trying to scrape, especially if you need JavaScript to run smoothly to access the desired data.

---

You may, or may not have noticed that scraped urls in the precedent example come with a nasty `#` at their beginning. This was made so one could not click through and arrive on another strange or perverted website.

However, being the precise data lover you are, this may annoy you very much. So let's retrieve the data we need while dropping those nasty hashtags.

```js
var niceList = artoo.scrape('.url-list a', {
  url: function() {
    return $(this).attr('href').slice(1);
  },
  title: 'text'
});
```

And here is your clean list.

```js
[
  {
    url: 'http://nicesite.com',
    title: 'Nice site'
  },
  {
    url: 'http://awesomesite.com',
    title: 'Awesome site'
  },
  {
    url: 'http://prettysite.com',
    title: 'Pretty site'
  },
  {
    url: 'http://unknownsite.com',
    title: 'Unknown site'
  }
]
```

---

<h2 id="more-complex-list">A more complex list</h2>
It's really a shame but data does not comes in such a handy shape everyday. What about a more - but not too - complex list like this one?

<ul class="complex-url-list">
  <li>
    <a href="#http://nicesite.com">Nice site</a><br>
    <span class="nb">14 visits</span>
  </li>
  <li>
    <a href="#http://awesomesite.com">Awesome site</a><br>
    <span class="nb">22 visits</span>
  </li>
  <li>
    <a href="#http://prettysite.com">Pretty site</a><br>
    <span class="nb">2 visits</span>
  </li>
  <li>
    <a href="#http://unknownsite.com">Unknown site</a><br>
    <span class="nb">45 visits</span>
  </li>
</ul>

A quick look into your browser's inspector should tell you this second list is thusly expressed:

```html
<ul class="complex-url-list">
  <li>
    <a href="#http://nicesite.com">Nice site</a><br>
    <span class="nb">14 visits</span>
  </li>
  <li>
    <a href="#http://awesomesite.com">Awesome site</a><br>
    <span class="nb">22 visits</span>
  </li>
  <li>
    <a href="#http://prettysite.com">Pretty site</a><br>
    <span class="nb">2 visits</span>
  </li>
  <li>
    <a href="#http://unknownsite.com">Unknown site</a><br>
    <span class="nb">45 visits</span>
  </li>
</ul>
```

Let's say we want to retrieve the url, the title and the number of visits of the sites. Just order **artoo** to execute the following command:

```js
var niceList = artoo.scrape('.complex-url-list > li', {
  url: {
    sel: 'a',
    attr: 'href'
  },
  title: {
    sel: 'a',
    method: 'text'
  },
  nb_visits: function() {
    return +$(this).find('span').text().replace(' visits', '');
  }
});
```

And you'll find yourself with the following list.

```js
[
  {
    url: '#http://nicesite.com',
    title: 'Nice site',
    nb_visit: 14
  },
  {
    url: '#http://awesomesite.com',
    title: 'Awesome site',
    nb_visit: 22
  },
  {
    url: '#http://prettysite.com',
    title: 'Pretty site',
    nb_visit: 2
  },
  {
    url: '#http://unknownsite.com',
    title: 'Unknown site',
    nb_visit: 45
  }
]
```

---

<h2 id="downloading-list">Downloading your list</h2>
Ok, now that you scraped your list, you might tell me:

> &laquo; *Yay! I've got my list in a nice JavaScript array. But what do I do to save it to a file? Should I do `JSON.stringify(niceList)` and copy the output string?* &raquo;

God no!

**artoo** is a handy droid and will make your browser download the list with the following command:

```js
artoo.savePrettyJson(niceList);
```

Now you should see your browser download a `data.json` file containing your scraped list and if `chrome` bothers you and tells you are trying to download too much, just tell him to get lost.

And if you are more the CSV kind of guy.

```js
artoo.saveCsv(niceList);
```

---
<h2 id="remember">Remember, remember</h2>
Having written some commands now, you might find yourself in delicate position.

> &laquo; *How on earth am I going to remember all the possibly complex commands I just wrote into my browser console?* &raquo;

> &laquo; *It would be nice I could just download a `js` script containing everything I executed while scraping this fine site.* &raquo;

```js
artoo.saveInstructions();
```

---

<h2 id="what-next">What next?</h2>
The intention of this quick introduction was merely to show you that **artoo** is full of helpers you can use in order to make your client-side scraping tasks as easy and enjoyable as can be.

Furthermore, **artoo**'s helpers are often polymorphic and offer you a lot of different ways to express what you want to do. Just choose the shorter one or the one that fits the more your coding style.

---

**artoo**, more than just scraping lists and downloading files, is therefore able to expand or scroll web page's content programmatically, to save persistent data in the local storage or in remote databases, to inject scripts, to crawl different websites, to trigger series of ajax queries and a lot of other things you'll be able to find in the **[methods]({{ site.baseurl }}/methods)** compendium of this documentation.

---

Finally, if you happen to be a super lazy guy or if you need to perform more complex scraping jobs and need, for instance, to overcome some websites' particularly nasty `Content-Security-Policy` headers, **artoo** also exists as a [chrome extension]({{ site.baseurl }}/chrome).

This extension, given you activate it, automatically injects **artoo** into every page you visit and override websites' responses headers in order to make client-side scraping a possibility.
