;(function(undefined) {
  'use strict';

  /**
   * artoo navigation methods
   * =========================
   *
   * Enables artoo to change pages. It is only useful if the chrome extension
   * is installed so artoo can be injected by default on every page.
   */
  var _root = this;

  artoo.navigateTo = function(url) {
    window.location.assign(url);
  };
}).call(this);
