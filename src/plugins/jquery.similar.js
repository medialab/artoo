;(function(undefined) {
  'use strict';

  /**
   * artoo similar elements finder
   * ==============================
   *
   * Experimental plugin designed to find similar elements relevant to the one
   * selected.
   */

  var classBlackList = [
    'hidden',
    'disabled',
    'active',
    'activated',
    'odd',
    'even',
    'first',
    'last'
  ];

  function _similar($) {
    $.fn.similar = function() {
      var $e = $(this).first(),
          $cur = $e,
          $sel = null,
          path = $e.path(false).split(' > '),
          clsScore,
          bestClsScore,
          bestCls,
          c,
          i;

      // We try to drop specific selection in a reverse order
      for (i = path.length - 1; i > -1; i--) {
        c = path[i];

        // Removing ids and nth-child
        c = c.replace(/#[^.#:]+/g, '');
        c = c.replace(/:nth-child\(\d+\)/g, '');

        // Dropping specific classes
        c = c.replace(/\.[^.#:]+/g, '');

        // Adding best class
        bestClsScore = 0;
        bestCls = null;
        $cur.classes().forEach(function(cls) {
          if (!~classBlackList.indexOf(cls)) {
            clsScore = $('.' + cls).length;

            if (clsScore > 2 && clsScore > bestClsScore) {
              bestClsScore = clsScore;
              bestCls = cls;
            }
          }
        });

        if (bestCls)
          c += '.' + bestCls;


        // Are there more than one element in the new selection?
        path[i] = c;
        $sel = $(path.join(' > ') + ':visible');

        // If two elements or more are selected, we have a potential winner
        if ($sel.length > 2)
          break;

        // TODO: try to compute identity from selected nodes and compute
        // statistical anomalies.
        // If anomalies overcome a threshold, the selector is probably not that good

        // TODO: then we should try to expand to siblings just to be sure.

        // Go to parent
        $cur = $cur.parent();
      }

      return $sel || $(this);
    };

    $('*').click(function(e) {
      $('.aaa').css('color', 'black');
      e.stopPropagation();
      e.preventDefault();
      $('.aaa').removeClass('aaa');
      $(this).similar().addClass('aaa');
      $('.aaa').css('color', 'red');
    });
  }

  // Exporting
  artoo.jquery.plugins.push(_similar);
}).call(this);
