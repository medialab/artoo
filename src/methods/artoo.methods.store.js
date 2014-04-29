;(function(undefined) {
  'use strict';

  /**
   * artoo store methods
   * ====================
   *
   * artoo's abstraction of HTML5's local storage.
   */
  var _root = this;
  artoo.store = {};

  // Testing for the availablity of the localStorage
  artoo.store.available = 'localStorage' in _root;
  if (!artoo.store.available)
    artoo.hooks.init.push(function() {
      this.log.warning(
        'localStorage not available. You might want to upgrade ' +
        'your browser.'
      );
    });

  // Utilities
  function coerce(value, type) {
    if (type === 'boolean')
      value = (value === 'true');
    else if (type === 'number')
      value = +value;
    else if (type === 'object')
      value = JSON.parse(value);
    return value;
  }

  // TODO: automatic typing
  // TODO: querying?
  // TODO: used space

  // Methods
  artoo.store.get = function(key, type) {
    var value = localStorage.getItem(key);
    return value !== null ? coerce(value, type || 'string') : value;
  };

  artoo.store.getNumber = function(key) {
    return this.get(key, 'number');
  };

  artoo.store.getBoolean = function(key) {
    return this.get(key, 'boolean');
  };

  artoo.store.getObject = function(key) {
    return this.get(key, 'object');
  };

  artoo.store.keys = function(key) {
    var keys = [],
        i;
    for (i in localStorage)
      keys.push(i);

    return keys;
  };

  artoo.store.getAll = function() {
    var store = {};
    for (var i in localStorage)
      store[i] = this.get(i);
    return store;
  };

  artoo.store.set = function(key, value, o) {
    if (typeof key !== 'string' && typeof key !== 'number')
      artoo.log.error('Trying to set an invalid key to localStorage. ' +
                      'Keys should be strings or numbers.');
    else
      localStorage.setItem(key, o ? JSON.stringify(value) : '' + value);
  };

  artoo.store.setObject = function(key, value) {
    this.set(key, value, true);
  };

  artoo.store.remove = function(key) {
    localStorage.removeItem(key);
  };

  artoo.store.removeAll = function() {
    for (var i in localStorage)
      localStorage.removeItem(i);
  };

  // Shortcut
  artoo.s = artoo.store;
}).call(this);
