;(function(undefined) {
  'use strict';

  /**
   * artoo DOM element footprint computation
   * ========================================
   *
   * Experimental plugin designed to express the footprint of a DOM
   * element.
   */

  // Helpers
  function shallowArrayCompare(a, b) {
    var i, l;

    for (i = 0, l = Math.max(a.length, b.length); i < l; i++)
      if (a[i] !== b[i])
        return false;
    return true;
  }

  // TODO: on content also
  function _footprint($) {
    $.fn.footprint = function() {
      var $e = $(this).first(),
          footprint = [],
          identity,
          txt;

      // Iterating through childrens
      $e.children().each(function() {

        // Tag name
        identity = $(this).prop('tagName').toLowerCase();

        // Class if class is used more than once in document
        $(this).classes().forEach(function(c) {
          if ($('.' + c).length > 1 && c !== 'hidden' && c !== 'activated')
            identity += '.' + c;
        });

        // What does each contains
        var txt = $(this).text().trim();
        if (!txt) {
          identity += '@empty';
        }
        else {
          if (~txt.search(/\w/))
            identity += '@letters'
          if (~txt.search(/\d/))
            identity += '@numbers'
        }

        // Pushing identity
        footprint.push(identity);
      });

      return footprint;
    };

    $('*').click(function(e) {
      console.log($(this).parent().footprint());
      e.stopPropagation();
      e.preventDefault();
    });
  }

  // Exporting
  artoo.jquery.plugins.push(_footprint);
}).call(this);
