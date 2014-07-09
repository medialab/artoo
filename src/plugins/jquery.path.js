;(function(undefined) {
  'use strict';

  /**
   * artoo path retrieval jQuery plugin
   * ===================================
   *
   * Experimental plugin designed to retrieved the css path of selected
   * DOM elements.
   */

  function _path($) {
    $.fn.path = function(optimal) {
      optimal = (optimal === false) ? false : true;

      var $e = $(this),
          $c = $e,
          $a,
          path = [],
          sel,
          i;

      // Safeguard
      if (this.length !== 1)
        throw Error('jquery.path: should apply on a single element.');

      while (($c.prop('tagName') || '').toLowerCase() !== 'body') {

        // If the current selector is already optimal, we break
        if (optimal) {
          $a = $(path.join(' > '));
          if ($a.length === 1 && $a.get(0) === $e.get(0))
            break;
        }

        // Phase initialization
        sel = $c.prop('tagName').toLowerCase();
        i = '';

        // Getting an id
        if ($c.attr('id')) {
          sel += '#' + $c.attr('id');
        }

        // Getting a relevant classes
        else if ($c.attr('class')) {
          $c.classes().forEach(function(c) {
            if ($c.parent().children('.' + c).length === 1)
              sel += '.' + c;
          });
        }

        // Getting a nth-child if nothing else works
        if ($c.parent().children(sel).length > 1)
          i = ':nth-child(' + ($c.index() + 1) + ')';

        path.unshift(sel + i);

        // Next
        $c = $c.parent();
      }

      // Returning the path
      return path.join(' > ') || 'body';
    };
  }

  // Exporting
  artoo.jquery.plugins.push(_path);
}).call(this);
