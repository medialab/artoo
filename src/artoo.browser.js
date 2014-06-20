;(function(undefined) {
  'use strict';

  /**
   * artoo browser module
   * =====================
   *
   * Detects in which browser artoo is loaded and what are its capabilities
   * so he can adapt gracefully.
   */
  var _root = this,
      inBrowser = 'navigator' in _root;

  // Helpers
  function checkFirebug() {
    var firebug = true;
    for (var i in _root.console.__proto__) {
      firebug = false;
      break;
    }
    return firebug;
  }

  // Namespace
  artoo.browser = {

    // Browsers
    chrome: 'chrome' in _root,
    firefox: inBrowser && !!~navigator.userAgent.search(/firefox/i),

    // Debuggers
    firebug: checkFirebug()
  };

  artoo.browser.which =
    artoo.helpers.first(Object.keys(artoo.browser), function(b) {
      return artoo.browser[b];
    }) || null;
}).call(this);
