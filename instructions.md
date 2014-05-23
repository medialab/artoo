---
layout: page
title: artoo.instructions
id: instruction
---

# {{ page.title }}

---

On *chrome* and *chromium*, **artoo** is able to record the instructions you are typing within the console by hooking onto the browser's console evaluation function.

This is useful if you want to get back every instructions you typed during a scraping session. You might indeed need this code again.

By default, **artoo** records the instructions you type from the moment he is loaded into the web page. If you want to alter this behaviour, you should pay a visit to the [settings]({{ site.baseurl }}/settings#instructions) section of this documentation.

It is also possible to download you instructions in the form of a JavaScript file but more precisions are available in the [save]({{ site.baseurl }}/save#instructions) section.

---

* [artoo.instructions](#instructions)
* [artoo.instructions.getScript](#get-script)
* [artoo.instructions.startRecording](#start-recording)
* [artoo.instructions.stopRecording](#stop-recording)

---

<h2 id="instructions">artoo.instructions</h2>
`artoo.instructions` is a function having for alias `artoo.instructions.get` and returning an array of instructions typed into the console since **artoo** began to record them.

```js
artoo.instructions();
// OR
artoo.instructions.get();
```

*Example*

```js
var list = artoo.scrape('ul > li', 'text');
artoo.savePrettyJson(list);

artoo.instructions();
[
  "var list = artoo.scrape('ul > li', 'text');",
  "artoo.savePrettyJson(list);"
]
```

---

<h2 id="get-script">artoo.instructions.getScript</h2>
This function return the instructions typed in the console as an aggregated JavaScript string. It is in fact used by the function `artoo.saveInstructions()` to download the said instructions.

```js
artoo.instructions.getScript();
```

*Example*

```js
var list = artoo.scrape('ul > li', 'text');
artoo.savePrettyJson(list);

artoo.instructions();
"// http://currentUrl
 // Mon May 19 2014 20:56:50 GMT+0200 (CEST)
 var list = artoo.scrape('ul > li', 'text');

 artoo.savePrettyJson(list);"
```

---

<h2 id="start-recording">artoo.instructions.startRecording</h2>
This function tells **artoo** to start recording typed instructions (**artoo** will do it by default if no settings indicates him the contrary).

```js
artoo.instructions.startRecording();
```

---

<h2 id="stop-recording">artoo.instructions.stopRecording</h2>
This function tells **artoo** to stop recording typed instructions.

```js
artoo.instructions.stopRecording();
```
