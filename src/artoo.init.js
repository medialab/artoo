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
  function main() {

    // Welcoming user
    this.log.welcome();

    // Injecting jQuery
    this.jquery.inject(function() {
      artoo.log.info('artoo is now good to go!');

      // Triggering ready
      if (artoo.$.isFunction(artoo.ready))
        artoo.ready(artoo);
    });

    // Updating artoo state
    this.loaded = true;
  }
  artoo.hooks.init.unshift(main);

  // Init?
  if (!artoo.loaded)
    artoo.hooks.init.map(function(h) {
      h.apply(artoo, h);
    });
}).call(this);
