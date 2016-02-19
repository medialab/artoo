;(function(undefined) {
  'use strict';

  /**
   * artoo asynchronous store methods
   * =================================
   *
   * artoo's abstraction of meta-browser storages such as chrome extensions
   * or phantomjs stores.
   */
  var _root = this;

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

  // Exporting factory
  artoo.createAsyncStore = AsyncStoreFactory;
}).call(this);
