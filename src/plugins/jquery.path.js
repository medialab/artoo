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
    $.fn.path = function() {
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
        $a = $(path.join(' > '));
        if ($a.length === 1 && $a.get(0) === $e.get(0))
          break;

        // Phase initialization
        sel = $c.prop('tagName').toLowerCase();
        i = '';

        // If this, we get index if needed
        if ($c === $e && $e.parent().children($e.prop('tagName')).length > 1)
          i = ':nth-child(' + $e.index() + ')';

        if ($c.attr('id'))
          sel += '#' + $c.attr('id');
        else if ($c.attr('class'))
          sel += $c.attr('class').split(' ').map(function(c) {
            return '.' + c;
          }).join('');

        path.unshift(sel + i);

        // Next
        $c = $c.parent();
      }

      // Returning the path
      return path.join(' > ');
    };
  }

  // Exporting
  artoo.jquery.plugins.push(_path);
}).call(this);
