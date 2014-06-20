---
layout: page
title: artoo.store
id: store
---

# {{ page.title }}

---

**artoo.js**' store module provides you with a useful `Storage` interface. It becomes really handy when some persistent data has to be saved and accessed throughout a scraping session.

If you are unfamiliar with `localStorage` and its affiliates, it is highly advisable that you start by reading some [documentation](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage) to learn their downsides.

The `localStorage` is used by default. If you need to change this, you should see the relevant [setting]({{ site.baseurl }}/settings#store).

Note also that `artoo.store` can be accessed through the shortcut `artoo.s` if needed.

---

* [artoo.store](#store)
* [artoo.store.getAll](#get-all)
* [artoo.store.keys](#keys)
* [artoo.store.set](#set)
* [artoo.store.pushTo](#push)
* [artoo.store.update](#update)
* [artoo.store.remove](#remove)
* [artoo.store.removeAll](#remove-all)

---

<h2 id="store">artoo.store</h2>
`artoo.store` is a function having for alias `artoo.store.get` and returning either the whole store as a JavaScript object or only one key if specified.

```js
artoo.store([key]);
```

*Examples*

```js
// Retrieving one key
artoo.store('hello');
>>> 'world'

// Retrieving the whole store
artoo.store();
>>> {
  hello: 'world',
  color: 'blue',
  number: 4
}
```

---

<h2 id="get-all">artoo.store.getAll</h2>
`artoo.store.getAll` is the same as calling `artoo.store` without specifying a key, meaning that you will retrieve the whole store as a JavaScript object.

---

<h2 id="keys">artoo.store.keys</h2>
`artoo.store.keys` is a function returning an array of the keys in the store.

*Example*

```js
artoo.store.keys();
>>> ['hello', 'color', 'number'];
```

---

<h2 id="set">artoo.store.set</h2>
`artoo.store.set` lets you set keys to the store while taking care of JSON stringification for you. Contrary to `localStorage` standard interface, you need not worry about what you insert into the store when using `artoo.store` module.

```js
artoo.store.set(key, value);
```

*Examples*

```js
// Setting a string
artoo.store.set('hello', 'world');

// Setting a number
artoo.store.set('number', 4);

// Setting an object
artoo.store.set('object', {key1: 'ok', key2: 'ko'});
```

---

<h2 id="push">artoo.store.pushTo</h2>
`artoo.store.pushTo` is a little helper that enables you to push to a store array without having to retrieve it first and reset it after the item is pushed.

```js
artoo.store.pushTo(arrayKey, item);
```

Note that **artoo** will stop you if you try to push to a non-array value.

---

<h2 id="update">artoo.store.update</h2>
`artoo.store.update` is a little helper that enables you to update a store object without having to retrieve it first and reset it after the object is updated.

```js
artoo.store.update(objectKey, {key1: 'modified key'});
```


Note that **artoo** will stop you if you try to push to a non-object value.

---

<h2 id="remove">artoo.store.remove</h2>
`artoo.store.remove` simply removes the given key from the store.

```js
artoo.store.remove(key);
```

---

<h2 id="remove-all">artoo.store.removeAll</h2>
`artoo.store.removeAll` simply cleans the store of everything.

```js
artoo.store.removeAll();
```

Note that `artoo.store.clean` also exists as a alias for this method.
