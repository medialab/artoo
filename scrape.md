---
layout: page
title: artoo.scrape
id: scrape
---

# {{ page.title }}

---

**artoo**'s main goal is to provide you with some useful scraping helpers and this is precisely what the following methods do.

It is advisable, however, to check the [quick start]({{ site.baseurl }}/quick_start) section of this documentation to find a less exhaustive but more didactic presentation of `artoo.scrape` method.

---

* [artoo.scrape](#scrape)
* [artoo.scrapeOne](#scrape-one)
* [artoo.scrapeTable](#scrape-table)

---

<h2 id="scrape">artoo.scrape</h2>
`artoo.scrape` is the heart of **artoo**'s scraping techniques. It takes a selector as its root iterator and then takes the data model you intent to extract at each step of the iteration.

For instance, you could need to iterate on a list while extracting the id and the text of each element of the list.

```js
artoo.scrape(iterator, model, [params, callback]);
```

---

### Arguments

* **iterator**  *css selector | jQuery selector* : the selection of the elements on which you want to iterate.
* **model**     *mixed* : the model of the data you want to scrape and its retrievers.
* **params**    *?object* : an object of optional parameters.
  * **limit**   *?integer* : the number of items you want to scrape if you do not want each of them.
  * **done**    *?function* : a function taking as only argument the scraped items and to be triggered when the scraping is done.
* **callback**  *?function* : same as `params.done`.


---

### Data model

Choosing a data model when using `artoo.scrape` is just a matter of deciding whether you want the function to return an array of values or rather an array of items with properties you prealably chose.

```js
// Passing a single element to the method will
// return an array of the wanted data
artoo.scrape('ul > li', 'text');
>>> ['text of first li', 'text of second li']

// Passing an object to the method will
// return an array of items
artoo.scrape('ul > li', {text: 'text', id: 'id'});
>>> [
  {text: 'text of fist li', id: 'first-li'},
  {text: 'text of second li', id: 'second-li'}
]
```

---

### Retrievers

Ok, but now that you know what kind of array you want to be returned, you need to specify how to retrieve the wanted data.

There are three ways to get what you want with `artoo.scrape`:

---

#### a single string

Basically, if you pass a string as your retriever, **artoo** will try to apply the given jQuery method, `text` or `html` for instance, to the current item in the iteration, else he'll try to find a relevant attribute.

```js
// We want to retrieve the html of the elements
artoo.scrape('ul > li', 'html');

// We want to retrieve the href of the elements
artoo.scrape('ul a', 'href');
```

---

#### an expressive object

If you need something a little more complex like subselection but want to stay concise, you can also use an expressive object.

```js
// The sel attribute in the object passed as retriever enables you
// to perform a subselection
artoo.scrape('ul > li', {
  text: {sel: 'span', method: 'text'},
  url: {sel: 'a', attr: 'href'}
});
```
Possible properties for a retriever object are the following:

* **attr** *?string* : an attribute to retrieve.
* **defaultValue** *?mixed* : a default value to return in case the retriever would return a falsy value or `NaN`.
* **method** *?string | ?function* : the name of a jQuery element method like `text` or `html` or a custom function.
* **scrape** *?object* : helper for recursivity. See [recursivity](#recursivity) for complete documentation.
* **sel** *?css Selector | jQuery selector* : a subselector for the retriever (will apply `.find(sel)` to the current element in iteration). If a `method` property is given as a function, `$(this)` will correspond to this subselection.



---

#### a function

Finally, if none of the above methods work for you, you remain free to pass a function that will perform the data retrieval.

Note that a function passed to `artoo.scrape` follows jQuery paradigms: `this` would actually be a reference to the current DOM element in the iteration.

You can therefore use `$(this)` as you would in any jQuery callback.

```js
artoo.scrape('ul > li', function() {
  return +$(this).attr('data-nb') * 4;
});
```

Note also that functions passed as retrievers can take an argument which is actually **artoo**'s internal jQuery reference.You can read the reason why [here]({{ site.baseurl }}/jquery#dollar).

```js
artoo.scrape('ul > li', {
  text: function($) {
    return $(this).text();
  },
  nb: function($) {
    return +$(this).attr('data-nb');
  }
})
```

<h3 id="recursivity">Recursivity</h3>

If you need recursivity within the `artoo.scrape` method, rather that calling the method itself in a function retriever, you can also pass an object with the scrape property like in the example below.

```js
artoo.scrape('ul.list > li', {
  scrape: {
    sel: 'ul.sublist > li',
    data: 'text'
  }
});
>>> [['item1-1', 'item1-2'], ['item2-1', 'item2-2']]
```

---

<h2 id="scrape-one">artoo.scrapeOne</h2>

`scrapeOne` is works the same way as `scrape` but will only return the first element. It is strictly the same as passing `1` as the `limit` parameter.

```js
artoo.scrapeOne(iterator, model, [params, callback]);
```

*Example*

```js
artoo.scrapeOne('ul a', {url: 'href', title: 'text'});
>>> {
  url: 'http://firstelement.com',
  title: 'First Element'
}
```

---

<h2 id="scrape-table">artoo.scrapeTable</h2>

`scrapeTable` is a handful helper when you need to scrape data from a HTML table.

```js
artoo.scrapeTable(selector, [params, callback]);
```

*Arguments*

* **selector** *css selector | jQuery selector* : the root selector of the table you need to scrape.
* **params** *?object* : an object of optional parameters.
  * **limit** *?integer* : the number of items you want to scrape if you do not want each of them.
  * **headers** *?mixed*: see below.
  * **data** *?object* : the data retriever as expressed for the `scrape` method if needed.
  * **done** *?function* : a function taking as only argument the scraped items and to be triggered when the scraping is done.
* **callback** : same as `params.done`.

*Headers*

It is possible to specify headers for the scraped table. If you do so, instead of returning an array of array, the `scrapeTable` method will return an array of objects.

You can therefore specify headers through the following ways:

* **a string** : either `'first'` to declare the first row as headers or `'th'` if the table as regular HTML headers.
* **an object** : a configuration object containing at least one of the following parameters.
  * **type** *?string* : same as passing a string.
  * **method** *?function* : a function to be called on each iteration of the desired headers.

*Example*

<table class="reference">
  <tr>
    <td><b>First Name</b></td>
    <td><b>Last Name</b></td>
    <td><b>Points</b></td>
  </tr>
  <tr>
    <td>Jill</td>
    <td>Smith</td>
    <td>50</td>
  </tr>
  <tr>
    <td>Eve</td>
    <td>Jackson</td>
    <td>94</td>
  </tr>
  <tr>
    <td>John</td>
    <td>Doe</td>
    <td>80</td>
  </tr>
  <tr>
    <td>Adam</td>
    <td>Johnson</td>
    <td>67</td>
  </tr>
</table>

To scrape the above table and download it as a CSV file, just execute the following command:

```js
artoo.scrapeTable('table.reference', {
  headers: 'first',
  done: artoo.saveCsv
});
```
