;(function(undefined) {
  'use strict';

  /**
   * artoo classes jQuery plugin
   * ============================
   *
   * Simplistic jQuery plugin designed to retrieve a list of classes for the
   * given elements.
   */

  function _classes($) {
    $.fn.classes = function() {
      var index = {},
          cls;

      $(this).each(function() {
        cls = $(this).attr('class');
        if (cls)
          cls.trim().split(' ').forEach(function(c) {
            index[c] = true;
          });
      });

      return Object.keys(index);
    };
  }

  // Exporting
  artoo.jquery.plugins.push(_classes);
}).call(this);
