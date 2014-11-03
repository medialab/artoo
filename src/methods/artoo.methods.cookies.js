;(function(undefined) {
  'use strict';

  /**
   * artoo cookies methods
   * ======================
   *
   * artoo's abstraction to handle the page's cookies.
   */
  var _root = this;

  artoo.cookies = function(key) {
    return artoo.cookies.get(key);
  };

  artoo.cookies.get = function(key) {
    var cookies = artoo.parsers.cookies(document.cookie);
    return (key ? cookies[key] : cookies);
  };

  artoo.cookies.set = function(key, value, params) {
    document.cookie = artoo.writers.cookie(key, value, params);
  };

  artoo.cookies.remove = function(key) {
    // ;expires=Thu, 01 Jan 1970 00:00:01 GMT
  };

  // remove, clear
}).call(this);
