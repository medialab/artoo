;(function(undefined) {
  'use strict';

  /**
   * artoo store methods
   * ====================
   *
   * artoo's abstraction of HTML5's storage.
   */
  var _root = this;
  artoo.store = {};

  // Store alias
  // TODO: make a function if we wanted to change engine while artoo is running
  // or else if we'd need another store in the meantime.
  var engine = artoo.settings.store.engine,
      _store;

  if (engine === 'local')
    _store = localStorage;
  else if (engine === 'session')
    _store = sessionStorage;
  else
    artoo.log.error('Invalid store engine: "' + engine + '".');

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
  // TODO: used space

  // Methods
  artoo.store.get = function(key, type) {
    var value = _store.getItem(key);
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
    for (i in _store)
      keys.push(i);

    return keys;
  };

  artoo.store.getAll = function() {
    var store = {};
    for (var i in _store)
      store[i] = this.get(i);
    return store;
  };

  artoo.store.set = function(key, value, o) {
    if (typeof key !== 'string' && typeof key !== 'number') {
      artoo.log.error('Trying to set an invalid key to store. ' +
                      'Keys should be strings or numbers.');
      return;
    }
    _store.setItem(key, o ? JSON.stringify(value) : '' + value);
  };

  artoo.store.setObject = function(key, value) {
    this.set(key, value, true);
  };

  artoo.store.push = function(key, value) {
    var a = this.getObject(key);

    if (!$.isArray(a)) {
      artoo.log.error('Trying to push to a non-array for store key "' +
                      key + '".');
      return;
    }

    a.push(value);
    this.setObject(key, a);
  };

  artoo.store.update = function(key, object) {
    var o = this.getObject(key);

    if (!artoo.$.isPlainObject(o)) {
      artoo.log.error('Trying to update a non-object for store key "' +
                      key + '".');
      return;
    }

    this.setObject(key, artoo.helpers.extend(object, o));
  };

  artoo.store.remove = function(key) {
    _store.removeItem(key);
  };

  artoo.store.removeAll = function() {
    for (var i in _store)
      _store.removeItem(i);
  };

  // Shortcut
  artoo.s = artoo.store;
}).call(this);
