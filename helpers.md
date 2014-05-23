---
layout: page
title: artoo.helpers
id: helpers
---

# {{ page.title }}

---

**artoo**'s helpers module's aim is to provide you with some useful but miscellaneous function ranging from external script injection to array conversion.

---

**Root helpers** - *callable from `artoo`*

* [artoo.getGlobalVariables](#global-variables)
* [artoo.injectScript](#inject-script)
* [artoo.waitFor](#wait-for)

**Standard helpers** - *callable from `artoo.helpers`*

* [artoo.helpers.toCSVString](#to-csv-string)

---

<h2 id="global-variables">artoo.getGlobalVariables</h2>
Returns global variables set by the page itself.

This can be useful if you need to search for loopholes in the page's JavaScript code.

Sometimes, you don't even need to scrape as the developer forgot his/her variables containing the data you need in the global scope.

```js
artoo.getGlobalVariables();
```

---

<h2 id="inject-script">artoo.injectScript</h2>
Inject a remote script into the current webpage and trigger a callback when the browser has retrieved it.

```js
artoo.injectScript(url, [callback]]);
```

*Example*

```js
artoo.injectScript('//randomcdn/jquery-1.11.0.min.js', function() {
  console.log('Finished injecting jquery version 1.11.0');
});
```

---

<h2 id="wait-for">artoo.waitFor</h2>
Wait for some event to happen before triggering a callback. This is especially useful when you need, for instance, to wait for the webpage to load some elements before continuing to scrape.

```js
artoo.waitFor(condition, callback, [params]);
```

*Arguments*

* **condition**      *function* : a function returning false if the event you are waiting for has not happen or true in the other case.
* **callback**       *?function* : a function to trigger when your event has finally happened. Note that if callback is an object, it will be considered as the *params* argument.
* **params**         *?object* :  an object that may contain the following properties:
  * **done**         *?function* : same as callback argument.
  * **interval**     *?integer* [`30`] : Interval in milliseconds between each check of the condition.
  * **timeout**      *?integer* : Timeout in milliseconds. Callback will be called with first argument as false.

*Example*

```js
// We are waiting for a list to populate
var currentLength = $('.list-item').length;

artoo.waitFor(
  function() {
    return $('.list-item').length > currentLength;
  },
  function() {
    console.log('Yay, new items in the list!');
  }
);
```

---

<h2 id="to-csv-string">artoo.helpers.toCSVString</h2>
Converts an array of array into a CSV string or an array of objects into a CSV string with headers.

*Arguments*

* **data**             *array* : The array of array or array of object to convert into a CSV string.
* **delimiter**        *?string* [`,`] : The field delimiter.
* **escapeCharacter**  *?string* [`"`] : The escape character for the fields and the field delimiter.

*Example*

```js
var persons =[
   {
     firstname: 'Caroline',
     lastname: 'Williams'
   },
   {
     filename: 'Steven',
     lastname: 'Douglas'
   }
];

artoo.helpers.toCSVString(persons);
>>> 'firstname,lastname
     Caroline,Williams
     Steven,Douglas'
```

