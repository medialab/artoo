;(function(undefined) {
  'use strict';

  /**
   * artoo initialization
   * =====================
   *
   * Loading a single instance of artoo into the web page while checking for
   * potential usurpers and acting accordingly.
   */

  // Initialization hook
  function initHook() {

    // Welcoming user
    artoo.log.welcome();

    // Injecting jQuery
    artoo.jquery.inject(function() {
      artoo.log('artoo is now good to go!');
    });

    // Updating artoo state
    artoo.loaded = true;
  }

  // Init?
  if (!artoo.loaded)
    initHook();
}).call(this);
