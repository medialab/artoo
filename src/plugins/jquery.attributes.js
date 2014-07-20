;(function(undefined) {
  'use strict';

  /**
   * artoo attributes jQuery plugin
   * ===============================
   *
   * Simplistic jQuery plugin designed to retrieve list of attributes for the
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
