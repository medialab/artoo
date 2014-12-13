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
* [artoo.injectInlineStyle](#inject-inline-style)
* [artoo.waitFor](#wait-for)

**Standard helpers** - *callable from `artoo.helpers`*

* [artoo.helpers.createDocument](#document)
* [artoo.helpers.jquerify](#jquerify)

**Parsers** - *callable from `artoo.parsers`*

* [artoo.parsers.cookie](#cookie)
* [artoo.parsers.cookies](#cookies)
* [artoo.parsers.headers](#headers)
* [artoo.parsers.queryString](#querystring)
* [artoo.parsers.url](#url)

**Writers** - *callable from `artoo.writers`*

* [artoo.writers.cookie](#cookie-writer)
* [artoo.writers.csv](#to-csv-string)
* [artoo.writers.queryString](#querystring-writer)
* [artoo.writers.yaml](#to-yaml-string)

**Cookies** - *callable from `artoo.cookies`*

* [artoo.cookies.get](#cookies-get)
* [artoo.cookies.set](#cookies-set)
* [artoo.cookies.remove](#cookies-remove)

**Custom console** - *callable from `artoo.log`*

* [artoo.log](#log)
* [artoo.log.verbose](#levels)
* [artoo.log.debug](#levels)
* [artoo.log.info](#levels)
* [artoo.log.warning](#levels)
* [artoo.log.error](#levels)

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
artoo.injectStyle(url, [callback]]);
```

*Example*

```js
artoo.injectStyle('//localhost:8000/style.css', function() {
  console.log('Finished injecting my custom css rules');
});
```

---

<h2 id="inject-inline-style">artoo.injectInlineStyle</h2>
Inject a css style string into the current webpage.

```js
artoo.injectInlineStyle(styleString);
```

*Example*

```js
artoo.injectInlineStyle('.my-class {color: red;}');
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
  * **timeout**      *?integer* : Timeout in milliseconds. Callback will be called with first argument as a timeout Error.

*Example*

```js
// We are waiting for a list to populate
var currentLength = $('.list-item').length;

artoo.waitFor(
  function() {
    return $('.list-item').length > currentLength;
  },
  function(err) {
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

<h2 id="cookie">artoo.parsers.cookie</h2>
Parses a cookie string.

```js
artoo.parsers.cookie(
  'name2=value2; Expires=Wed, 09 Jun 2021 10:18:14 GMT'
);
>>> {
  httpOnly: false,
  secure: false,
  key: 'name2',
  value: 'value2',
  expires: 'Wed, 09 Jun 2021 10:18:14 GMT'
}
```

---

<h2 id="cookies">artoo.parsers.cookies</h2>
Parses a string containing one or more cookies and return an object storing them in a key/value fashion. Typically, this can be used to parse `document.cookie`.

```js
artoo.parsers.cookies(document.cookie);
>>> {
  cookie1: 'value1',
  cookie2: 'value2'
}
```

---

<h2 id="headers">artoo.parsers.headers</h2>
Parses a string containing HTTP headers. Typically, this can be used to parse XHR headers.

```js
artoo.parsers.headers(xhr.getAllResponseHeaders());
>>> {
  Date: 'Sat, 13 Dec 2014 15:27:42 GMT'
  Connection: 'keep-alive'
  Content-Length: '9072'
  Content-Type: 'text/html; charset=utf-8'
}
```

---

<h2 id="querystring">artoo.parsers.queryString</h2>
Parses a querystring.

```js
artoo.parsers.queryString('var1=value1&var2=value2');
>>> {
  var1: 'value1',
  var2: 'value2'
}
```

---

<h2 id="url">artoo.parsers.url</h2>
Parses the given url as [Node.js](http://nodejs.org/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost) would.

```js
artoo.parsers.url('http://localhost:8000')
>>> {
  href: 'http://localhost:8000/',
  protocol: 'http',
  host: 'localhost:8000',
  hostname: 'localhost',
  port: 8000,
  path: '/',
  pathname: '/',
  domain: 'localhost'
}
```

---

<h2 id="cookie-writer">artoo.writers.cookie</h2>
Creates a cookie string with given parameters

```js
artoo.writers.cookie(key, value, [params]);
```

*Arguments*

* **key** *string*: the cookie's key.
* **value** *string*: the cookie's value.
* **params** *?object*: an object of optional parameters and containing the following keys.
  * **days** *?integer*: number of days before cookie expiration.
  * **domain** *?string*: cookie's domain.
  * **httpOnly** *?boolean* [`false`]: should the cookie be httpOnly?
  * **path** *?string*: cookie's path.
  * **secure** *?boolean* [`false`]: should the cookie be secure?

*Example*

```js
artoo.writers.cookie('myKey', 'myValue', {
  httpOnly: true
});
>>> 'myKey=myValue; HttpOnly'
```

---

<h2 id="to-csv-string">artoo.writers.csv</h2>
Converts an array of array into a CSV string or an array of objects into a CSV string with headers.

```js
artoo.writers.csv(data, [params]);
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

artoo.writers.csv(persons);
>>> 'firstname,lastname
     Caroline,Williams
     Steven,Douglas'
```

<h2 id="querystring-writer">artoo.writers.queryString</h2>
Converts an object into a query string.

```js
artoo.writers.queryString(object, [caster]);
```

*Arguments*

* **object** *object*: a simple key/value object to convert.
* **caster** *?function*: a function used to cast values into the desired format.

*Examples*

```js
artoo.writers.queryString({hello: 'world'});
>>> 'hello=world'

artoo.writers.queryString(
  {
    hello: 'world',
    secure: true,
    authenticated: false
  },
  function(v) {
    if (v === true)
      return 1;
    else if (v === false)
      return 0;
    else
      return v;
  }
);
>>> 'hello=world&secure=1&authenticated=0'
```

---

<h2 id="to-yaml-string">artoo.writers.yaml</h2>
Converts a JavaScript variable into a YAML string.

```js
artoo.writers.yaml(data);
```

*Example*

```js
var data = {
  hello : 'world',
  how: 'are you?',
  colors: ['yellow', 'blue']
};

artoo.writers.yaml(data);
>>> '---
     hello: world
     how: are you?
     colors:
       - yellow
       - blue'
```

---

<h2 id="cookies">artoo.cookies</h2>

*artoo.cookies* provides a simple way to interact with the host page's stored cookies.

<em id="cookies-get">Retrieving cookies</em>

```js
// Get every cookies
artoo.cookies();
artoo.cookies.get();
artoo.cookies.getAll();

// Get cookie by key
artoo.cookies(key);
artoo.cookies.get(key);
```

<em id="cookies-set">Setting cookies</em>

As per [artoo.writers.cookie](#cookie-writer).

```js
artoo.cookies.set(key, value, [params]);
```

<em id="cookies-remove">Removing cookies</em>

```js
// Remove cookie by key
artoo.cookies.remove(key);

// Removing every cookies
artoo.cookies.removeAll();
artoo.cookies.clear();
```

---

<h2 id="log">artoo.log</h2>
Provide a simple and colorful way to log data to your console.

<em id="levels">Levels</em>

* *verbose* : cyan
* *debug* : blue
* *info* : green
* *warning* : orange
* *error* : red

*Examples*

```js
// If no level is provided, 'debug' is taken by default.
artoo.log('hello');
artoo.log('hello', 'info');

// Some aliases exist
artoo.log.verbose('hello');
artoo.log.debug('hello');
artoo.log.info('hello');
artoo.log.error('hello');
artoo.log.warning('hello');
```
