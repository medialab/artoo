---
layout: page
title: Chrome extension
id: chrome
---

# {{ page.title }}

---

**artoo** can also be used as a chrome extension.

This is rather an experimental feature and can only perform two things for the time being:

* It can load **artoo** in every page you visit.
* It can override pages' responses headers in order to shunt `Content-Security-Policy` headers.

---

If you do not know about `Content-Security-Policy` headers, you should read [this](http://www.html5rocks.com/en/tutorials/security/content-security-policy/).

> &laquo; *Why is* `Content-Security-Policy` *an issue for artoo?* &raquo;

Well it can simply prevent **artoo** from being injected into a web page such as `facebook` or `github` and we don't want this.

---

## Installation

**artoo**'s extension only comes in a rough version for now and cannot be installed automatically.

Here is what you need to do to install it:

```js
// Clone artoo's repo
git clone https://github.com/medialab/artoo
cd artoo
npm install
grunt uglify
```

Then go to chrome's extension page, tick the developer mode's checkbox and load the unpacked extension.

---

## Usage

Given that **artoo**' extension is installed, you'll notice an **artoo** icon on your chrome toolbar. You can click this icon to activate or deactivate **artoo**.

The extension is therefore activated when the icon is colored and deactivated when the icon is greyed.
