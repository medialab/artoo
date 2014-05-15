;(function(undefined) {
  'use strict';

  /**
   * artoo initialization
   * =====================
   *
   * Launch artoo's init hooks.
   */

  // Initialization hook
  function main() {

    // Retrieving settings from script tag
    if (artoo.dom)
      artoo.settings = artoo.helpers.extend(
        JSON.parse(artoo.dom.getAttribute('settings')),
        artoo.settings
      );

    // Welcoming user
    this.log.welcome();

    // Indicating we are injecting artoo from the chrome extension
    if (artoo.settings.chromeExtension)
      artoo.log.verbose('artoo has automatically been injected ' +
                        'by the chrome extension.');

    // Injecting jQuery
    this.jquery.inject(function() {
      artoo.log.info('artoo is now good to go!');

      // Applying jQuery plugins
      artoo.jquery.plugins.map(function(p) {
        p(artoo.$);
      });

      // Loading extra script?
      if (artoo.settings.script)
        eval(artoo.settings.script);
      if (artoo.settings.next)
        artoo.injectScript(artoo.settings.next);


      // Triggering ready
      artoo.hooks.trigger('ready');
    });

    // Deleting artoo's dom element
    if (artoo.dom)
      artoo.dom.parentNode.removeChild(artoo.dom);

    // Updating artoo state
    this.loaded = true;
  }

  // Placing the hook at first position
  artoo.hooks.init.unshift(main);

  // Init?
  if (!artoo.loaded && artoo.settings.autoInit)
    artoo.hooks.trigger('init');
}).call(this);
