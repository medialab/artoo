---
layout: page
title: artoo.spiders
id: spiders
---

# {{ page.title }}

---

**artoo.js**' spiders aims at triggering a series of HTTP requests to collect some data.

---

* [artoo.ajaxSpider](#ajax)

----

<h2 id="ajax">artoo.ajaxSpider</h2>
An ajax spider aimed at triggering a series of ajax requests and passing the accumulated data to a final callback.

```js
artoo.ajaxSpider(urlList, [params, callback]);
```

*Examples*

```js
// Basic
artoo.ajaxSpider(['url1', 'url2'], function(data) {
  console.log('Retrieved data:', data);
});

// Complex
artoo.ajaxSpider(
  function(i) {
    return 'http://domain.com/' + i + '.json';
  },
  {
    method: 'getJSON',
    process: function(data) {
      return data.posts;
    },
    throttle: 3000,
    limit: 10
  },
  function(data) {
    console.log('Retrieved data:', data);
  }
);
```

*Arguments*

* **urlList** *array | function* : the list of urls to request through ajax or, alternatively, a function taking as arguments the index of the iteration and the data of the last request, and returning either the desired url or `false` to break the spider.
* **params** *?object | ?function* : a object containing optional parameters. If params is a function, it will be considered as the `callback` argument.
  * **process** *?function* : a function to be triggered each time data is retrieved through ajax. This function takes as arguments the retrieved data, the current index and the current data accumulated. Also, this function should either return the wanted data to accumulate or `false` to break the spider.
  * **throttle** *?integer | ?function*: Number of milliseconds to wait between two ajax requests. You can also pass a function taking the current index and returning the time to wait.
  * **method** *?string* [`'get'`] : the default HTTP or jQuery method.
  * **data** *?object* : the default data object to pass as the requests parameters.
  * **url** *?string* : the default url to query. This is useful when querying the same url through POST over and over when only sent data is changing.
  * **settings** *?object* : a settings object as you would pass it to jQuery [ajax](http://api.jquery.com/jquery.ajax/) method.
  * **scrape** *?object* : rather than a callback, you may pass a configuration object for the [scrape]({{ site.baseurl }}/scrape) method that will be automatically called on the retrieved data.
  * **scrapeOne** *?object* : same as the `scrape` argument except that the method called will be `scrapeOne`.
  * **concat** *?boolean* [`false`] : should the data retrieved be concatenated into the accumulator or merely pushed?
  * **limit** *?integer* : maximum number of requests to perform.
  * **jquerify** *boolean* [`false`] : should the retrieved data be passed to the callbacks as a jQuery selector? Useful when you need to hit urls returning html.
  * **done** *?function* : same as `callback` argument.
* **callback** : callback fired when the spider iteration is over and taking as argument the accumulated data.

*Urls List*

The spider can take the following as urls:

* a simple string.
* an object that may contain the following keys:
  * **url** *string* : the url string.
  * **method** *?string* : the http or jQuery method for the request.
  * **data** *?object* : an optional data object to pass as the request parameters.
  * **settings** *?object* : a settings object as you would pass it to jQuery [ajax](http://api.jquery.com/jquery.ajax/) method.

If you use a function rather than a list to generate your urls, this one is obviously entitled to return the same items as those you would find in the list.
