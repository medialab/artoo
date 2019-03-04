---
layout: page
title: artoo.autoExpand
id: expand
---

# {{ page.title }}

---

**artoo.js**' autoExpand methods let you expand web pages' contents programmatically.

This is useful in pages that require user input like clicking on buttons triggering ajax requests or in pages featuring an infinite scroll.

---

* [artoo.autoExpand](#expand)
* [artoo.autoScroll](#scroll)

---

<h2 id="expand">artoo.autoExpand</h2>
Programmatically expand page's content by performing some action and waiting for their results.

```js
artoo.autoExpand(params, [callback]);
```

*Concept*

You can basically expand content on webpage by following two distincts approaches:

* Either you want a number of elements to grow and you can therefore indicate the selector of those elements to the `autoExpand` method and it will react based on this.
* Or you can provide the method with some state searching functions like: can I expand content? or is content currently expanding?

*Examples*

```js
// Approach n°1
// We track the number of posts elements and we
// expand the content by clicking the relevant button.
artoo.autoExpand({
  elements: '.posts',
  expand: '.expand-button',
  limit: 2,
  done: function() {
    console.log('Done expanding posts twice!');
  }
});

// Approach n°2
// Here, if the expand button exist, we click it
// and we wait until the loading gif has disappeared
// to continue our expansion.
artoo.autoExpand({
  expand: function($) {
    $('.expand-button').simulate('click');
  },
  canExpand: '.expand-button',
  isExpanding: function($) {
    return $('.post-loading-gif').is(':visible');
  },
  throttle: 5000,
  done: function() {
    console.log('Done expanding every posts!');
  }
});
```

*Arguments*

* **params** *object* : an object of parameters.
  * **expand** *function or css selector* : a required function programmatically performing the action needed to expand the desired content. You can alternatively pass a css selector as the expand parameter and **artoo** will assume he has to click the selected elements.
  * **elements** *css selector* : selector on the watched elements. For instance, if you want to expand posts and posts have the class `.posts`, the `autoExpand` method will wait until more of those elements exist to assert the expansion has worked.
  * **canExpand** *?function or ?css selector* : a function returning a boolean and asserting whether content can or cannot be expanded. Alternatively, a selector meaning true if at least one of the elements is present.
  * **isExpanding** *?function or ?css selector* : a function returning a boolean and asserting whether content is currently expanding. This typically tracks the visibility or existence of a loading animation or gif. Alternatively a selector meaning true if at least one of the elements is present.
  * **limit** *?integer* : maximum number of expansions.
  * **throttle** *?integer or ?function* : time to wait between each expansion in milliseconds or, alternatively, a function taking as argument the index of the expansion and returning the time to wait.
  * **timeout** *?integer* : time in milliseconds before triggering a timeout.
  * **done** *?function* : same as `callback` argument.
* **callback** *?function* : a function to be fired when expansion is eventually finished.


---

<h2 id="scroll">artoo.autoScroll</h2>
The `autoScroll` method is an `autoExpand` variant that does not take an expand function as it assumes this one has only to scroll the page to its bottom.

You remain free to pass any parameters to the `autoScroll` method the same way you would with the `autoExpand` one.

```js
artoo.autoScroll([params, callback]);
```

*Example*

```js
artoo.autoScroll({
  elements: '.posts',
  limit: 3,
  done: function() {
    console.log('Finished scrolling three times!');
  }
});
```
