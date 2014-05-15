;(function(undefined) {
  'use strict';

  /**
   * artoo beep
   * ===========
   *
   * Experimental feature designed to make artoo beep.
   */
  var base64beep = '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';

  // Playing the base64 sound
  artoo.beep = function() {
    new Audio('data:audio/mpeg;base64,' + base64beep).play();
  };
}).call(this);