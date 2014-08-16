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

  /**
   * Abstract factory for asynchronous stores
   * -----------------------------------------
   *
   * Return an helper function to access asynchronous stores such as the one
   * provided by the chrome extension or by phantomjs.
   *
   * An asynchronous store must be initiated with a sender function that would
   * enable communication between the page and the browser's utilities.
   *
   * Note that such a function must return a state-of-the-art promise.
   */

  // Helpers
  function checkCallback() {
    return (typeof arguments[arguments.length - 1] !== 'function') ?
      artoo.$.Deferred() :
      arguments[arguments.length - 1];
  }

  // TODO: enhance and ajust to promise polymorphism
  function brokenPipe() {
    throw Error('artoo.asyncStore: broken pipe.');
  }

  // The factory itself
  function AsyncStoreFactory(sender) {

    if (typeof sender !== 'function')
      throw TypeError('artoo.asyncStore: expecting a sender function.');

    // Communication
    function communicate(action, params, promise) {
      if (arguments.length < 3) {
        promise = params;
        params = null;
      }

      sender(action, params)
        .then(function() {
          if (typeof promise !== 'function')
            promise.resolve.apply(null, arguments);
          else
            promise.apply(null, arguments);
        })
        .fail(brokenPipe);

      return typeof promise !== 'function' ? promise : undefined;
    }

    // Returning a function
    var store = function(key) {
      return store.get(key);
    };

    // Methods
    store.get = function(key, cb) {
      var promise = checkCallback.apply(this, arguments);

      if (!key)
        return store.getAll();

      // Requesting data
      return communicate('get', {key: key}, promise);
    };

    store.getAll = function(cb) {
      var promise = checkCallback.apply(this, arguments);

      // Requesting data
      return communicate('getAll', promise);
    };

    store.keys = function(cb) {
      var promise = checkCallback.apply(this, arguments);

      // Requesting store's keys
      return communicate('keys', promise);
    };

    store.set = function(key, value, cb) {
      var promise = checkCallback.apply(this, arguments);

      if (typeof key !== 'string' && typeof key !== 'number')
        throw TypeError('artoo.store.set: trying to set an invalid key.');

      return communicate('set', {key: key, value: value}, promise);
    };

    store.remove = function(key, cb) {
      var promise = checkCallback.apply(this, arguments);

      if (typeof key !== 'string' && typeof key !== 'number')
        throw TypeError('artoo.store.set: trying to remove an invalid key.');

      return communicate('remove', {key: key}, promise);
    };

    store.removeAll = function(cb) {
      var promise = checkCallback.apply(this, arguments);

      return communicate('removeAll', promise);
    };

    store.clear = store.removeAll;

    return store;
  }

  // Exporting factories
  artoo.createStore = StoreFactory;
  artoo.createAsyncStore = AsyncStoreFactory;

  // Creating artoo's default store to be used
  artoo.store = StoreFactory(artoo.settings.store.engine);

  // Shortcuts
  artoo.s = artoo.store;
}).call(this);
