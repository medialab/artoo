;(function(undefined) {
  'use strict';

  /**
   * artoo initialization
   * =====================
   *
   * Batch of operations to be run when launching artoo into a web page.
   */
  function init() {

    // Welcoming user
    artoo.welcome();

    // Injecting jQuery
    artoo.inject(function() {
      artoo.log('artoo is now good to go!');
    });
  }

  init();
}).call(this);
