;(function(undefined) {
  'use strict';

  /**
   * artoo persistent state
   * =======================
   *
   * artoo's persistent state abstraction. It populates itself if the state key
   * is present for the current page so the user might keep some data from page
   * to page.
   */
  var _root = this;

  // Getting artoo's state
  artoo.state = function() {
    return artoo.state.get();
  };

  artoo.state.get = function(key) {
    return key ?
      (artoo.store(artoo.settings.state.key)[key] || null) :
      (artoo.store(artoo.settings.state.key) || {});
  };

  artoo.state.set = function(key, value) {
    var c = artoo.store(artoo.settings.state.key) || {};
    c[key] = value;
    artoo.store.set(artoo.settings.state.key, c);
  };

  artoo.state.remove = function(key) {
    var c = artoo.store(artoo.settings.state.key) || {};
    delete c[key];
    if (!Object.keys(c).length)
      artoo.state.clear();
    else
      artoo.store.set(artoo.settings.state.key, c);
  };

  artoo.state.removeAll = function() {
    artoo.store.remove(artoo.settings.state.key);
  };
}).call(this);
