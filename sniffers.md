---
layout: page
title: Sniffers
id: sniffers
---

# {{ page.title }}

---

**artoo.js** bundles some sniffers to help you grab some of the circulating data of the web page you need to scrape.

For instance, the ajax sniffer enables you to fire callbacks whenever ajax requests are made or received. This way you can understand how the page retrieves data and use it to achieve your goal.

---

*Example*

You need to retrieve the subtitles of a video on a website and know that the site uses an ajax request to get them back. However, the request might be really hard to forge and could need tokens and a lot of silly parameters.

But you, as a user, know that clicking a button will trigger the ajax request because the UI works so.

You can therefore tap on the ajax response's data with `artoo.ajaxSniffer.after` to retrieve the needed subtitles.

---

**Ajax Sniffer**

* [artoo.ajaxSniffer.before](#ajax-before)
* [artoo.ajaxSniffer.after](#ajax-after)
* [artoo.ajaxSniffer.off](#ajax-off)

---

<h2 id="ajax-before">artoo.ajaxSniffer.before</h2>

Gives you a chance to register a callback to be fired any time an ajax request is made by the page.

```js
artoo.ajaxSniffer.before(callback);
```

*Callback arguments*

Note that within the callback, `this` refer to the current `xhr` object.

* **request** : an object containing informations about the request to be made and containing the following:
    * **url** *string* : the requested url.
    * **method** *string* : the HTTP method of the request.
    * **params** *object* : parsed GET parameters of the requested url.
    * **querystring** *string* : unparsed querystring sent as form data.
    * **data** *object* : parsed form data.

*Example*

```js
// Counting number of times the GET article url is hit
var count = 0;

artoo.ajaxSniffer.before(function(req) {
  if (~req.url.search(/article/))
    count++;
});
```

---

<h2 id="ajax-after">artoo.ajaxSniffer.after</h2>

Gives you a chance to register a callback to be fired any time an ajax request is completed by the page.

```js
artoo.ajaxSniffer.after(callback);
```

*Callback arguments*

Note that within the callback, `this` refer to the current `xhr` object.

* **request** : an object containing informations about the request to be made and containing the following:
    * **url** *string* : the requested url.
    * **method** *string* : the HTTP method of the request.
    * **params** *object* : parsed GET parameters of the requested url.
    * **querystring** *string* : unparsed querystring sent as form data.
    * **data** *object* : parsed form data.
* **response** : an object containing informations about the ajax response and containing the following:
    * **headers** *object* : object of parsed response headers.
    * **data** *mixed* : a parsed response (either a JSON object or an XML document or a string).

*Example*

```js
// Downloading json data retrieved through complex ajax request
artoo.ajaxSniffer.after(function(req, res) {
  artoo.savePrettyJson(res.data);
});
```

---

<h2 id="ajax-off">artoo.ajaxSniffer.off</h2>

Remove the given callback from the ajax sniffing stack.

```js
artoo.ajaxSniffer.off(callback);
```
