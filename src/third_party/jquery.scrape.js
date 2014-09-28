;(function(undefined) {
  'use strict';

  /**
   * artoo jQuery scrape plugin
   * ===========================
   *
   * Hooking artoo.scrape on jQuery for convenience.
   */

  function _scrape($) {
    var methods = ['scrape', 'scrapeOne', 'scrapeTable'];

    methods.forEach(function(method) {

      $.fn[method] = function() {
        return artoo[method].apply(
          artoo, [$(this)].concat(Array.prototype.slice.call(arguments)));
      };
    });
  }

  // Exporting
  artoo.jquery.plugins.push(_scrape);
}).call(this);
