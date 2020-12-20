---
layout: page
title: User Interface
id: ui
---

# {{ page.title }}

---

Sometimes, when designing a tool or a bookmarklet for non-dev people, you might want to display a UI to facilitate things.

**artoo.js** therefore enables you to leverage [HTML5 Shadow DOM](http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/) to inject parasitic user interfaces in any web pages.

---

*Example*

You want to design an *à la carte* Google Scholar scraper for researchers.

You would be able, through the library's UI methods, to display a div with a fixed position on a Google Scholar result page proposing some options to the user as a button to finally download the scraped data as a CSV file.

---

*Note*

Building a user interface is never a trivial task and you might want a comfortable development environment to do so.

You might want to check the [Yeoman generator]({{ site.baseurl }}/yo) which is able to scaffold a full project for a bookmarklet necessiting a user interface.

---

**UI class**

* [artoo.ui](#ui)
* [artoo.ui.$](#dollar)
* [artoo.ui.injectStyle](#inject-style)
* [artoo.ui.injectInlineStyle](#inject-inline-style)
* [artoo.ui.kill](#kill)

**Stylesheets & Templates**

* [artoo.stylesheets](#stylesheets)
* [artoo.templates](#templates)

---

<h2 id="ui">artoo.ui</h2>

The *artoo.ui* class can be instantiated to create a Shadow DOM instance within the host page.

The main advantage of Shadow DOM in our case is that it will only abide by its own CSS style and not the one of the host page which is incredibly handy when designing parasitic interfaces.

Note however that the Shadow DOM implementations are quite recent and that it will require a fairly modern browser to work.
[Browsers that support Shadow DOM](http://caniuse.com/#search=shadow%20dom)

```js
var ui = new artoo.ui(params);
```

*Parameters*

* **name** *?string* : optional ui identifier.
* **mountNode** *?DOMElement* : the ui's Shadow DOM mount node. If none is provided, the body of the page will serve as the ui's mount node.
* **stylesheets** *?string or array* : An array of stylesheets names or a single stylesheet name to be injected from `artoo.stylesheets`.

*Properties*

* **mountNode** : the ui's mount node.
* **host** : the `div` hosting the Shadow DOM.
* **shadow** : the Shadom DOM reference.

---

<h2 id="dollar">artoo.ui.$</h2>

A **artoo.js**' ui instance comes with its own `$` method able to make jQuery selection within its Shadow DOM.

*Example*

```js
var ui = new artoo.ui();

// Appending a div to the Shadow DOM
ui.$().append('<div class="container"></div>');

// Selecting elements
var $container = ui.$('.container');
```

---

<h2 id="inject-style">artoo.ui.injectStyle</h2>

Inject a stylesheet coming from `artoo.stylesheets` into the ui's Shadow DOM.

```js
ui.injectStyle(stylesheetName);
```

---

<h2 id="inject-inline-style">artoo.ui.injectInlineStyle</h2>

Inject a CSS style string into the ui's Shadow DOM.

```js
ui.injectInlineStyle(styleString);
```

---

<h2 id="kill">artoo.ui.kill</h2>

Destroy a ui and its attached Shadow DOM permanently.

```js
ui.kill();
```

---

<h2 id="stylesheets">artoo.stylesheets</h2>

`artoo.stylesheets` is a variable where one can store a selection of stylesheets in a JavaScript object.

To see an example of how this variable is used, you should see how projects scaffolded by the [Yeoman generator]({{ site.baseurl }}/yo) use this variable to make stylesheets accessible to a bookmarklet.

---

<h2 id="templates">artoo.templates</h2>

`artoo.templates` is a variable where one can store a selection of templates in a JavaScript object.

To see an example of how this variable is used, you should see how projects scaffolded by the [Yeoman generator]({{ site.baseurl }}/yo) use this variable to make templates accessible to a bookmarklet.
