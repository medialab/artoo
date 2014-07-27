;(function(undefined) {
  'use strict';

  /**
   * artoo store methods
   * ====================
   *
   * artoo's abstraction of HTML5's storage.
   */
  var _root = this;

  // Utilities
  function isCache(key) {
    var d = artoo.settings.cache.delimiter;
    return key.charAt(0) === d && key.charAt(key.length - 1) === d;
  }

  // Store alias
  var _store;

  function setEngine(engine) {
    if (engine === 'local')
      _store = localStorage;
    else if (engine === 'session')
      _store = sessionStorage;
    else
      throw Error('artoo.store: wrong engine "' + engine + '".');
  }

  // Setting engine
  setEngine(artoo.settings.store.engine);

  // Namespace
  artoo.store = function(key) {
    return artoo.store.get(key);
  };

  // Methods
  artoo.store.get = function(key) {
    if (!key) {
      return artoo.store.getAll();
    }
    else {
      var v = _store.getItem(key);
      try {
        return JSON.parse(v);
      }
      catch (e) {
        return v;
      }
    }
  };

  artoo.store.getAll = function() {
    var s = {};
    for (var i in _store) {
      if (!isCache(i))
      s[i] = artoo.store.get(i);
    }
    return s;
  };

  artoo.store.keys = function(key) {
    var keys = [],
        i;
    for (i in _store)
      keys.push(i);

    return keys;
  };

  artoo.store.set = function(key, value) {
    if (typeof key !== 'string' && typeof key !== 'number')
      throw TypeError('artoo.store.set: trying to set an invalid key.');

    // Storing
    _store.setItem(key, JSON.stringify(value));
  };

  artoo.store.pushTo = function(key, value) {
    var a = artoo.store.get(key);

    if (!artoo.helpers.isArray(a) && a !== null)
      throw TypeError('artoo.store.pushTo: trying to push to a non-array.');

    a = a || [];
    a.push(value);
    artoo.store.set(key, a);
    return a;
  };

  artoo.store.update = function(key, object) {
    var o = artoo.store.get(key);

    if (!artoo.helpers.isPlainObject(o) && o !== null)
      throw TypeError('artoo.store.update: trying to udpate to a non-object.');

    o = artoo.helpers.extend(object, o);
    artoo.store.set(key, o);
    return o;
  };

  artoo.store.remove = function(key) {
    _store.removeItem(key);
  };

  artoo.store.removeAll = function() {
    for (var i in _store) {
      if (!isCache(i))
        _store.removeItem(i);
    }
  };

  // Shortcuts
  artoo.s = artoo.store;
  artoo.store.clean = artoo.store.removeAll;
}).call(this);
