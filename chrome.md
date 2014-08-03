---
layout: page
title: Chrome extension
id: chrome
---

# {{ page.title }}

---

**artoo.js** can also be used as a chrome extension.

This is rather an experimental feature and can only perform two things for the time being:

* It can inject **artoo.js** in every page you visit.
* It can override pages' responses headers in order to shunt `Content-Security-Policy` headers.

---

If you do not know about `Content-Security-Policy` headers, read [this](http://www.html5rocks.com/en/tutorials/security/content-security-policy/).

> &laquo; *Why is* `Content-Security-Policy` *an issue for artoo?* &raquo;

In short it can simply prevent **artoo.js** from being injected into some web pages such as `facebook` or `github` and we don't want that.

---

## Installation

The extension only comes in a rough version for now and cannot be installed automatically.

Here is therefore what you need to do:

```js
// Clone artoo's repo
git clone https://github.com/medialab/artoo
cd artoo
npm install
gulp chrome
```

Then go to chrome's extension page, tick the developer mode's checkbox and load the unpacked extension.

---

## Usage

Given that the extension is installed, you'll notice an icon on your chrome toolbar. You can click this icon to activate or deactivate **artoo.js**.

The extension is therefore activated when the icon is colored and deactivated when the icon is greyed.
