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

  artoo.cookies.getAll = function() {
    return artoo.cookies.get();
  };

  artoo.cookies.set = function(key, value, params) {
    document.cookie = artoo.writers.cookie(key, value, params);
  };

  artoo.cookies.remove = function(key, params) {
    var p = artoo.helpers.extend(params);

    // Ensuring no days were passed
    delete p.days;

    var cookie = artoo.writers.cookie(key, '*', p);

    // Passed expiration
    cookie += ' ;expires=Thu, 01 Jan 1970 00:00:01 GMT';

    document.cookie = cookie;
  };

  artoo.cookies.removeAll = function() {
    var cookies = artoo.cookies.getAll(),
        k;

    for (k in cookies)
      artoo.cookies.remove(k);
  };

  artoo.cookies.clear = artoo.cookies.removeAll;
}).call(this);
