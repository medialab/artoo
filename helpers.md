---
layout: page
title: artoo.helpers
id: helpers
---

# {{ page.title }}

---

**artoo.js**' helpers module's aim is to provide you with some useful but miscellaneous function ranging from external script injection to array conversion.

---

**Root helpers** - *callable from `artoo`*

* [artoo.getGlobalVariables](#global-variables)
* [artoo.injectScript](#inject-script)
* [artoo.injectStyle](#inject-style)
* [artoo.waitFor](#wait-for)

**Standard helpers** - *callable from `artoo.helpers`*

* [artoo.helpers.createDocument](#document)
* [artoo.helpers.jquerify](#jquerify)
* [artoo.helpers.toCSVString](#to-csv-string)
* [artoo.helpers.toYAMLString](#to-yaml-string)

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

<h2 id="inject-style">artoo.injectStyle</h2>
Inject a remote stylesheet into the current webpage and trigger a callback when the browser has retrieved it.

```js
artoo.injectScript(url, [callback]]);
```

*Example*

```js
artoo.injectStyle('//localhost:8000/style.css', function() {
  console.log('Finished injecting my custom css rules');
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

<h2 id="document">artoo.helpers.createDocument</h2>
Returns a new DOM document for you to use.

```js
artoo.helpers.createDocument([root, namespace]);
```

*Arguments*

* **root** *?string* : if not root is provided, the function will return a new HTML document. Otherwise, it will create a document having the specified root.
* **namespace** *?string* : an optional namespace.

*Examples*

```js
// Creating a new HTML document
artoo.helpers.createDocument();

// Creating an XML document containing fruits
artoo.helpers.createDocument('fruits');
```

---

<h2 id="jquerify">artoo.helpers.jquerify</h2>
Takes a string, a DOM document or else and returns a jquery object of it.

This is useful to retrieve a jquery usable object when you don't really know what you have to handle: HTML document, XML document, string, erroneous string...

```js
artoo.helpers.jquerify(data);
>>> $data
```

---

<h2 id="to-csv-string">artoo.helpers.toCSVString</h2>
Converts an array of array into a CSV string or an array of objects into a CSV string with headers.

```js
artoo.helpers.toCSVString(data, [params]);
```

*Arguments*

* **data**             *array* : The array of array or array of object to convert into a CSV string.
* **params** *?object* : an object of optional parameters and containing the following keys:
  * **delimiter**        *?string* [`,`] : The field delimiter.
  * **escape**  *?string* [`"`] : The escape character for the fields and the field delimiter.
  * **order** *?array* : if you pass an array of objects, the wanted keys and their order.
  * **headers** *?boolean | ?array* : if false, the fonction won't add a header line. If you provide an array, the header line will follow it. Note that, by default, a header line is added when an array of object is passed as `data`.

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

---

<h2 id="to-yaml-string">artoo.helpers.toYAMLString</h2>
Converts a JavaScript variable into a YAML string.

```js
artoo.helpers.toYAMLString(data);
```

*Example*

```js
var data = {
  hello : 'world',
  how: 'are you?',
  colors: ['yellow', 'blue']
};

artoo.helpers.toYAMLString(data);
>>> '---
     hello: world
     how: are you?
     colors:
       - yellow
       - blue'
```