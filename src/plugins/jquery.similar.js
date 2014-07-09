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
          path = $e.path(false).split(' > '),
          $sel = null,
          c,
          i;

      // We try to drop specific selection in a reverse order
      for (i = path.length - 1; i > -1; i--) {
        c = path[i];

        // Removing ids, classes and nth-child
        c = c.replace(/#[^.#:]+/g, '');
        c = c.replace(/\.[^.#:]+/g, '');
        c = c.replace(/:nth-child\(\d+\)/g, '');

        // Are there more than one element in the new selection?
        path[i] = c;
        $sel = $(path.join(' > '));

        if ($sel.length > 1)
          break;
      }

      return $sel || $(this);
    };

    // $('*').click(function(e) {
    //   $('.aaa').css('color', 'black');
    //   e.stopPropagation();
    //   e.preventDefault();
    //   $('.aaa').removeClass('aaa');
    //   $(this).similar().addClass('aaa');
    //   $('.aaa').css('color', 'red');
    // });
  }

  // Exporting
  artoo.jquery.plugins.push(_similar);
}).call(this);
