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
  function dice(a, b) {
    var intersection = 0,
        al = a.length - 1,
        bl = b.length - 1;

    if (al < 1 || bl < 1)
      return 0;

    var bis = [],
        ai,
        i,
        j;

    for (i = 0; i < bl; i++)
      bis.push(b.slice(i, i + 2));

    for (i = 0; i < al; i++) {
      ai = a.slice(i, i + 2);

      for (j = 0; j < bl; j++) {
        if (ai[0] === bis[j][0] && ai[1] === bis[j][1]) {
          intersection++;
          bis[j] = [null, null];
          break;
        }
      }
    }

    return (2.0 * intersection) / (al + bl);
  }

  function compare(a, b) {
    if (Math.abs(a.length - b.length) > 1)
      return false;

    var index = {},
        error = false,
        k;

    a.map(function(e) {
      index[e] = true;
    });

    b.map(function(e) {
      index[e] = true;
    });

    for (i in index) {
      if ((!~a.indexOf(i) || !~b.indexOf(i)) && error) {
        return false;
      }
      else if (!~a.indexOf(i) || !~b.indexOf(i)) {
        error = true;
      }
    }

    return true;
  }

  function _footprint($) {

    // Plugin itself
    $.fn.footprint = function(parent) {
      parent = parent === undefined ? true : parent;

      var $e = $(this).first(),
          footprint = [],
          txt;

      // Tag name
      footprint.push($e.prop('tagName').toLowerCase());

      // Class if class is used more than once in document
      $e.classes().forEach(function(c) {
        if ($('.' + c).length > 1 && c !== 'hidden' && c !== 'activated')
          footprint.push('.' + c);
      });

      // What are the characteristics of the node
      var txt = $e.text().trim(),
          nb_words = (txt.match(/\S+/g) || []).length;

      if ($e.children().length)
        footprint.push('@children');
      if (nb_words === 1)
        footprint.push('@word')
      if (nb_words > 1 && nb_words <= 3)
        footprint.push('@words');
      if (nb_words > 3)
        footprint.push('@sentence');
      if (~txt.search(/\w/))
        footprint.push('@letters');
      if (~txt.search(/\d/))
        footprint.push('@numbers');

      // Parent
      // if (parent)
      //   footprint.push(
      //     '@parent(' + $e.parent().footprint(false).join(',') + ')'
      //   );

      return footprint;
    };

    // Extending selectors
    $.extend($.expr[':'], {
      footprint: function(e, i, f) {
        return compare($(e).footprint(), f[3].split(','));
      }
    });
  }

  // Exporting
  artoo.jquery.plugins.push(_footprint);
}).call(this);
