---
layout: page
title: jQuery injection
id: methods
---

# {{ page.title }}

---

* [Why jQuery?](#why)
* [Logic of the injection](#logic)
* [The ß variable](#beta)
* [jQuery settings](#settings)
* [jQuery simulate](#simulate)
* [$ in artoo's functions](#dollar)

---

<h2 id="why">Why jQuery?</h2>

It would be a rather injust statement to say that jQuery is useless when it comes to DOM parsing and AJAX queries. This is indeed a nice and widely used library and anyone who tried to scrape data from HTML with jQuery once may have a lot of regrets while returning to XPath&#42;.

So, in order to make your scraping jobs an agreable moment, **artoo** injects jQuery within the page you are browsing.

But he does it carefully, ensuring that the injection of foreign code won't trouble the execution of the page you are scraping.

---

<h2 id="logic">Logic of the injection</h2>

The logic followed by **artoo**'s jQuery injection is the following:

> 1. If jQuery is present on the page in a correct version (superior to 2 by default), **artoo** does not do anything.
<br><br>
> 2. If jQuery is not present and if `$` is not used by some other library, **artoo** will inject a suitable version of jQuery.
<br><br>
> 3. Finally, if jQuery is present in a wrong version or if `$` is used by another library, **artoo** will load jQuery but won't override the page's `$`. jQuery will then be available through `artoo.$` and `ß`.

---

<h2 id="beta">The ß variable</h2>

As an helper, **artoo** will assign a reference to jQuery through the `ß` variable (usually `alt + b`).

---

<h2 id="settings">jQuery settings</h2>

If you find exhausting to use `artoo.$` or `ß` in pages where **artoo** thinks he should not automatically override them and if you know reassigning `$` won't cause trouble, you are obviously free to do so.

```js
var $ = artoo.$;
```

You can also force jQuery to override the present `$` variable in **artoo**'s [settings]({{ site.baseurl }}/settings/#jquery).

Finally, if you prefer another jQuery version, you can also configure it in the same [settings]({{ site.baseurl }}/settings/#jquery).

---

<h2 id="simulate">jQuery simulate</h2>

In order to be able to trigger complex DOM events as well as a human would, **artoo** encapsulate the jquery.simulate plugin.

It is commonly used to perform functionnal testing and ensure that interfaces are working correctly. But scrapers know it can be useful otherwise...

---

<h2 id="dollar">$ in artoo's functions</h2>

Knowing that you may not be able to access easily jQuery through `$`, **artoo** give access to his internal jQuery instance in some of his methods callbacks. This is for instance the case with the `artoo.scrape` method.

*Example*

```js
// The callbacks take a first argument being a reference to artoo.$
artoo.scrape('ul > li', function($) {
  return $(this).attr('data-name');
});
```

---

&#42; <small>Rejoice, XPath users, for `$x` exists in *chrome* and *chromium* if you ever need it.</small>
