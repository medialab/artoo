---
layout: page
title: Home
---

**artoo** is your new scraping companion. It is as fit for quick & dirty scraping jobs in your favorite browser's console as for more ambitious data burglaries.

---

But what does this mean in real world terms? Let's consider the following list:

<ul class="url-list">
  <li>
    <a href="http://nicesite.com">Nice site</a>
  </li>
  <li>
    <a href="http://awesomesite.com">Awesome site</a>
  </li>
  <li>
    <a href="http://prettysite.com">Pretty site</a>
  </li>
  <li>
    <a href="http://unknownsite.com">Unknown site</a>
  </li>
</ul>

It would be a shame if someone were to scrape it, no?

To achieve this we'll need **artoo**. Copy the following code and create a bookmark on your browser. Name it artoo and paste the code as the url.

```js
javascript:!function(){ {var a=document.getElementsByTagName("body")[0],b=document.createElement("script");Math.random()}b.src="//raw.githubusercontent.com/medialab/artoo/master/build/artoo.min.js",b.type="text/javascript",b.id="artoo_injected_script",a.appendChild(b)}();
```

---

Now that **artoo** is ready to go, open your browser's console and click on **artoo**'s bookmarklet so it could greet you with some formal sentence.

Let's scrape now!

If you open your html inspector, you'll quickly notice that the list we need to scrape is thusly written:

```html
<ul class="url-list">
  <li>
    <a href="http://nicesite.com">Nice site</a>
  </li>
  <li>
    <a href="http://awesomesite.com">Awesome site</a>
  </li>
  <li>
    <a href="http://prettysite.com">Pretty site</a>
  </li>
  <li>
    <a href="http://unknownsite.com">Unknown site</a>
  </li>
</ul>
```

Fortunately, **artoo** can scrape that for you, if you give him proper indications. Let's type the following command in our console:

```js
var niceList = artoo.scrape('.url-list a', {
  url: {attr: 'href'},
  title: {method: 'text'}
});
```
