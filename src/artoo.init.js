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
    if (artoo.dom) {
      var ns = JSON.parse(artoo.dom.getAttribute('settings')),
          s = artoo.settings,
          k;

      if (ns) {
        for (k in ns) {
          if (artoo.helpers.isPlainObject(ns[k]))
            s[k] = artoo.helpers.extend(ns[k], s[k]);
          else
            s[k] = ns[k];
        }
      }
    }

    // Welcoming user
    this.log.welcome();

    // Should we greet the user with a joyful beep?
    if (artoo.settings.log.beeping)
      artoo.beep();


    // Indicating we are injecting artoo from the chrome extension
    if (artoo.settings.chromeExtension)
      artoo.log.verbose('artoo has automatically been injected ' +
                        'by the chrome extension.');

    // Starting instructions recording
    if (artoo.settings.instructions.autoRecord)
      artoo.instructions.startRecording();

    // Injecting jQuery
    this.jquery.inject(function() {
      artoo.log.info('artoo is now good to go!');

      // Applying jQuery plugins
      artoo.jquery.plugins.map(function(p) {
        p(artoo.$);
      });

      // Loading extra script?
      // Order is: eval, localhost, gist
      if (artoo.settings.eval)
        eval(JSON.parse(artoo.settings.eval));
      else if (artoo.settings.scriptUrl)
        artoo.injectScript(artoo.settings.scriptUrl);

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
