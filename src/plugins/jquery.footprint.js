;(function(undefined) {
  'use strict';

  /**
   * artoo jquery footprint plugin
   * ==============================
   *
   * Experimental plugin designed to compute the footprint of a given
   * DOM element.
   */

  function _footprint($) {
    var blacklists = {
      classes: [
        'active',
        'activated',
        'disabled',
        'enabled',
        'even',
        'first',
        'hidden',
        'last',
        'odd'
      ],
      attributes: [
        'class',
        'href',
        'id',
        'name',
        'src',
        'style',
        'value'
      ]
    }

    $.fn.footprint = function(recur) {
      var $e = $(this).first(),
          $children,
          fp = [],
          attrs;

      //--1) Getting element tag name
      fp.push($e.prop('tagName').toLowerCase());

      //--2) Retrieving relevant classes
      $e.classes().forEach(function(c) {

        // Getting class usage
        // TODO: memoize this
        // TODO: find a finer statistical way
        if (!~blacklists.classes.indexOf(c) && $('.' + c).length > 2)
          fp.push('.' + c);
      });

      //--3) Retrieving attributes
      attrs = $e.attributes(blacklists.attributes);
      Object.keys(attrs).forEach(function(n) {
        fp.push('[' + n + ']');
      });

      //--4) Tagging
      // TODO: define whether a tagging utility is useful or not

      //--5) Computing parent
      if ($e.parent().prop('tagName') !== 'BODY' && recur !== false)
        fp.push('@parent(' + $e.parent().footprint(false).join(',') + ')');

      //--6) Computing children
      if (recur !== false) {
        $children = $e.children();
        if (!$children.length) {
          fp.push('@leaf');
        }
        else {
          $children.each(function() {
            fp.push('@child(' + $(this).footprint(false).join(',') + ')');
          });
        }
      }

      return fp;
    };
  }

  // Exporting
  artoo.jquery.plugins.push(_footprint);
}).call(this);
