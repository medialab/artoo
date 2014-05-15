;(function(undefined) {
  'use strict';

  /**
   * artoo store methods
   * ====================
   *
   * artoo's abstraction of HTML5's storage.
   */
  var _root = this;

  // Store alias
  var _store;

  function setEngine(engine) {
    if (engine === 'local')
    _store = localStorage;
    else if (engine === 'session')
      _store = sessionStorage;
    else
      artoo.log.error('Invalid store engine: "' + engine + '".');
  }

  // Setting engine
  setEngine(artoo.settings.store.engine);

  // Namespace
  artoo.store = function(key) {
    return artoo.store.get(key);
  };

  // Methods
  artoo.store.get = function(key) {
    return key ? JSON.parse(_store.getItem(key)) : artoo.store.getAll();
  };

  artoo.store.getAll = function() {
    var s = {};
    for (var i in _store)
      s[i] = artoo.store.get(i);
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
    if (typeof key !== 'string' && typeof key !== 'number') {
      artoo.log.error('Trying to set an invalid key to store. ' +
                      'Keys should be strings or numbers.');
      return;
    }

    // Storing
    _store.setItem(key, JSON.stringify(value));
  };

  artoo.store.pushTo = function(key, value) {
    var a = artoo.store.get(key);

    if (!$.isArray(a)) {
      artoo.log.error('Trying to push to a non-array for store key "' +
                      key + '".');
      return;
    }

    artoo.store.set(key, a.concat(value));
  };

  artoo.store.update = function(key, object) {
    var o = artoo.store.get(key);

    if (!artoo.$.isPlainObject(o)) {
      artoo.log.error('Trying to update a non-object for store key "' +
                      key + '".');
      return;
    }

    artoo.store.set(key, artoo.helpers.extend(object, o));
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
