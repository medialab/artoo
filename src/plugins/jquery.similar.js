;(function(undefined) {
  'use strict';

  /**
   * artoo similar elements finder
   * ==============================
   *
   * Experimental plugin designed to find similar elements relevant to the one
   * selected.
   */

  function _similar($) {
    $.fn.similar = function() {
      var $e = $(this).first(),
          $sel = null,
          footprint = $e.footprint(),
          path = $e.path(false).split(' > '),
          c,
          i;
console.log(footprint);
      // We try to drop specific selection in a reverse order
      for (i = path.length - 1; i > -1; i--) {
        c = path[i];

        // Removing ids, classes and nth-child
        c = c.replace(/#[^.#:]+/g, '');
        c = c.replace(/\.[^.#:]+/g, '');
        c = c.replace(/:nth-child\(\d+\)/g, '');

        // Are there more than one element in the new selection?
        path[i] = c;
        $sel = $(path.join(' > ') + ':footprint(' + footprint.join(',') + ')');

        // If two elements or more are selected, we have a potential winner
        if ($sel.length > 2)
          break;

        // TODO: try to compute identity from selected nodes and compute
        // statistical anomalies.
        // If anomalies overcome a threshold, the selector is probably not that good

        // TODO: then we should try to expand to siblings just to be sure.
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
