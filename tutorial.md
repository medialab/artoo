---
layout: page
title: Tutorial
---

# Tutorial

**artoo** is your new scraping companion. He is as fit for quick & dirty scraping jobs in your favorite browser's console as for more ambitious data burglaries.

---

But what does this mean in real world terms? Let's consider the following list:

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

It would be a shame if someone were to scrape it, no?

To achieve this we'll need **artoo**. We are therefore going to create a bookmarklet able to invoke artoo within a web page. Copy the code below and create a bookmark on your browser. Name it artoo and paste the code as the url.

```js
javascript:!function(){ {var a=document.getElementsByTagName("body")[0],b=document.createElement("script");Math.random()}b.src="//raw.githubusercontent.com/medialab/artoo/master/build/artoo.min.js",b.type="text/javascript",b.id="artoo_injected_script",a.appendChild(b)}();
```

---

Now that **artoo** is ready to go, open your browser's console and click on **artoo**'s bookmark so he could greet you with some formal sentence.

Let's scrape now!

If you open your html inspector, you'll quickly notice that the list we need to scrape is thusly written:

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

Easy, no?


---

More complex drop # function plus jQuery
