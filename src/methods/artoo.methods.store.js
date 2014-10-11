;(function(undefined) {
  'use strict';

  /**
   * artoo store methods
   * ====================
   *
   * artoo's abstraction of browser storages.
   */
  var _root = this;

  // Utilities
  function isCache(key) {
    var d = artoo.settings.cache.delimiter;
    return key.charAt(0) === d && key.charAt(key.length - 1) === d;
  }

  /**
   * Abstract factory for synchronous stores
   * ----------------------------------------
   *
   * Return an helper function to access simple HTML5 storages such as
   * localStorage and sessionStorage.
   *
   * Unfortunately, those storages are limited by the same-origin policy.
   */
  function StoreFactory(engine) {

    // Initialization
    if (engine === 'local')
      engine = localStorage;
    else if (engine === 'session')
      engine = sessionStorage;
    else
      throw Error('artoo.store: wrong engine "' + engine + '".');

    // Returning a function
    var store = function(key) {
      return store.get(key);
    };

    // Methods
    store.get = function(key) {
      if (!key)
        return store.getAll();

      var v = engine.getItem(key);
      try {
        return JSON.parse(v);
      }
      catch (e) {
        return v;
      }
    };

    store.getAll = function() {
      var s = {};
      for (var i in engine) {
        if (!isCache(i))
        s[i] = store.get(i);
      }
      return s;
    };

    store.keys = function(key) {
      var keys = [],
          i;
      for (i in engine)
        keys.push(i);

      return keys;
    };

    store.set = function(key, value) {
      if (typeof key !== 'string' && typeof key !== 'number')
        throw TypeError('artoo.store.set: trying to set an invalid key.');

      // Storing
      engine.setItem(key, JSON.stringify(value));
    };

    store.pushTo = function(key, value) {
      var a = store.get(key);

      if (!artoo.helpers.isArray(a) && a !== null)
        throw TypeError('artoo.store.pushTo: trying to push to a non-array.');

      a = a || [];
      a.push(value);
      store.set(key, a);
      return a;
    };

    store.update = function(key, object) {
      var o = store.get(key);

      if (!artoo.helpers.isPlainObject(o) && o !== null)
        throw TypeError('artoo.store.update: trying to udpate to a non-object.');

      o = artoo.helpers.extend(object, o);
      store.set(key, o);
      return o;
    };

    store.remove = function(key) {

      if (typeof key !== 'string' && typeof key !== 'number')
        throw TypeError('artoo.store.set: trying to remove an invalid key.');

      engine.removeItem(key);
    };

    store.removeAll = function() {
      for (var i in engine) {
        if (!isCache(i))
          engine.removeItem(i);
      }
    };

    store.clear = store.removeAll;

    return store;
  }

  // Exporting factory
  artoo.createStore = StoreFactory;

  // Creating artoo's default store to be used
  artoo.store = StoreFactory(artoo.settings.store.engine);

  // Shortcuts
  artoo.s = artoo.store;
}).call(this);
