---
layout: page
title: Changelog
id: changelog
---

# {{ page.title }}

---

## 0.3.0

* Several enhancements for uses within Phantom.js.
* Several enhancements to the beeping utility.
* Adding writers and parsers.
* Adding `artoo.cookies`.
* Adding [emmett](https://github.com/jacomyal/emmett) as event emitter.
* Removing instructions, alas.
* Fixing `artoo.helpers.jquerify`.
* Fixing `artoo.scrape` recursivity.
* Fixing log settings.
* Updating node.js process.
* Updating `jquery.simulate` to version `1.0.1-pre`.

---

## 0.2.0

* Adding Node.js version of the library.
* Enhancing Phantom.js support.
* Adding possibility to inject UI.
* Adding an ajax sniffer.
* Adding an `injectInlineStyle` helper.
* Adding a `scrapeOne` option to the ajaxSpider.
* Adding an async option to `injectScript` helper.
* Adding a `log.welcome` setting.
* Adding a `reExec` setting.
* Adding `$().scrape`.
* Adding `$().scrapeOne`.
* Adding `$().scrapeTable`.
* Adding `createStore`.
* Adding `createAsyncStore`.
* Adding XHR related parsers.
* Reworking the `waitFor` helper callback.
* Reworking dependencies system.
* Fixing some `store` bugs.
* Converting to gulp and adding a gulp plugin.
* Adding a Yeoman generator to scaffold bookmarklets.
* Removing base64 beep in favor of a more complete but lighter system.

---

## 0.1.1

* Adding `saveYaml`, `saveTsv` and `saveSvg`.
* Adding a `url` parameter to `ajaxSpider`.
* Adding an iterator polymorphism for `scrape`.
* Adding a `revoke` option for the `save` module.
* Adding a way to load popular dependencies such as `async` or `lodash`.
* Adding a `header` and `order` option to the `toCSVString` helper.
* Adding some headers when saving xml files.
* Filename polymorphism for the `save` module.
* Firebug support.
* Updating `jquery.simulate`.
* Fixing `settings.log.level`.
* Fixing several bugs.

---

## 0.1.0

* Initial release.
