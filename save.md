---
layout: page
title: artoo.save
id: save
---

# {{ page.title }}

---

**artoo.js**' save module enables you to download various things from JavaScript.

If your browser warns you about the webpage trying to download several items, just tell him it's gonna be ok and you should not be bothered again.

**Note**: every methods below can take the same parameters object as `artoo.save`. They are just not documented each time.

---

* [artoo.save](#save)
* [artoo.saveJson](#json)
* [artoo.savePrettyJson](#pretty)
* [artoo.saveCsv](#csv)
* [artoo.saveTsv](#tsv)
* [artoo.saveYaml](#yaml)
* [artoo.saveXml](#xml)
* [artoo.saveSvg](#svg)
* [artoo.saveHtml](#html)
* [artoo.savePageHtml](#page-html)
* [artoo.saveStore](#store)
* [artoo.saveInstructions](#instructions)
* [artoo.saveResource](#resource)
* [artoo.saveImage](#image)

---

<h2 id="save">artoo.save</h2>
Download data according to given parameters. This function should only be used if the next functions cannot satisfy your needs.

```js
artoo.save(data, [params]);
```

*Arguments*

* **data**   *string* : data to download.
* **params** *?object* : an object that may contain the following properties:
  * **mime**     *?string* : mime type of the file to download. Note that **artoo** provide some shortcuts for popular types such as `json`, `csv` `text` and `html`.
  * **encoding** *?string* : encoding of the file to download.
  * **filename** *?string* : name of the file to download.

---

<h2 id="json">artoo.saveJson</h2>
Dowload a JavaScript variable or a JSON string as a JSON file.

```js
artoo.saveJson(data, [params]);
```

*Additional parameters*

* **pretty** *?boolean* [`false`] : should the ouput JSON file be pretty-printed?
* **indent** *?integer* [`2`] : By how many spaces should we indent the JSON file?

*Example*

```js
artoo.saveJson({hello: world}, {filename: 'hello-world.json'});
```

---

<h2 id="pretty">artoo.savePrettyJson</h2>
Dowload a JavaScript variable or a JSON string as a pretty-printed JSON file.

```js
artoo.savePrettyJson(data, [params]);
```

This is the same as doing

```js
artoo.saveJson(data, {pretty: true});
```

---

<h2 id="csv">artoo.saveCsv</h2>
Download an array of array, an array of objects or a string as a CSV file.

```js
artoo.saveCsv(data, [params]);
```

*Additional parameters*

* **delimiter** *?string* [`,`] : the field delimiter.
* **escape**    *?string* [`"`] : the escape character.

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

artoo.saveCsv(persons);
```

For more precisions, refer to [artoo.helpers.toCSVString]({{ site.baseurl }}/helpers#to-csv-string) method.

---

<h2 id="tsv">artoo.saveTsv</h2>
This method is an alias of the `saveCsv` one and simply overrides the delimiter with `\t`.

```js
artoo.saveTsv(data, [params]);
```

---

<h2 id="yaml">artoo.saveYaml</h2>
Dowload a JavaScript variable as a YAML file.

```js
artoo.saveYaml(data, [params]);
```

---

<h2 id="xml">artoo.saveXml</h2>
Download a XML file from a string, a jQuery selector or a DOM document.

```js
artoo.saveXml(htmlData, [params]);
```

*Examples*

```js
artoo.saveXml($('#a_div_id'), {filename: 'div.html'});
artoo.saveXml(document);
```

---

<h2 id="svg">artoo.saveSvg</h2>
Download a SVG file from a jQuery selector.

```js
artoo.saveSvg(svgData, [params]);
```

This method is an alias of `artoo.saveXml`.

---

<h2 id="html">artoo.saveHtml</h2>
Download a HTML file from a string, a jQuery selector or a DOM document.

```js
artoo.saveHtml(htmlData, [params]);
```

This method is an alias of `artoo.saveXml`.

---

<h2 id="page-html">artoo.savePageHtml</h2>
Download the page's current Html.

```js
artoo.savePageHtml([params]);
```

---

<h2 id="store">artoo.saveStore</h2>
Save the content of the local storage as a JSON file. You can also alternatively select to download only the part corresponding to a key.

```js
artoo.saveStore([params]);
```

*Additional Parameters*

* **key** *?string* : the precise key to save.

*Example*

```js
artoo.saveStore({key: 'your-needed-key'});
```

---

<h2 id="instructions">artoo.saveInstructions</h2>
Save the instructions recorded by artoo as a JavaScript file.

```js
artoo.saveInstructions([params]);
```

If you want more precise information about how the instructions recording work, the [instructions]({{ site.baseurl }}/instructions) section of this documentation should be of help.

---

<h2 id="resource">artoo.saveResource</h2>
Save the resource located at the given url.


```js
artoo.saveResource(url, [params]);
```

*Example*

```js
artoo.saveResource('http://url-of-a-random-audio-file.mp3', {
  filename: 'MyAwesomeMusic.mp3'
});

artoo.saveResource('/public/css/style.css');
```

---

<h2 id="image">artoo.saveImage</h2>
Save an image corresponding either to a css or a jQuery selector.

**artoo** will name your file `[alt-attribute].extension` by default if you do not provide a `filename` parameter.

```js
artoo.saveImage(selector, [params]);
```

*Example*

```js
artoo.saveImage('#an_image_id');
```
