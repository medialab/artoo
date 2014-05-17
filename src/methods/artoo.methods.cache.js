;(function(undefined) {
  'use strict';

  /**
   * artoo cache
   * ============
   *
   * Create cache in the wanted storage for artoo to use.
   */
  var _root = this;

  // TODO: possibility to set the engine
  artoo.cache = {};
  artoo.cache.register = function(name) {
    var delimiter = artoo.settings.cache.delimiter,
        _name = delimiter + name + delimiter,
        c;

    // Base namespace
    c = function() {
      return c.get();
    };

    // Methods
    c.get = function(key) {
      return key ?
        ((artoo.store.get(_name) || {})[key] || null) :
        (artoo.store.get(_name) || {});
    };

    c.set = function(key, value) {
      var c = artoo.store.get(_name) || {};
      c[key] = value;
      artoo.store.set(_name, c);
    };

    c.remove = function(key) {
      var c = artoo.store.get(_name) || {};
      delete c[key];
      if (!Object.keys(c).length)
        artoo.state.clean();
      else
        artoo.store.set(_name, c);
    };

    c.clean = function() {
      artoo.store.remove(_name);
    };

    return c;
  };
}).call(this);
