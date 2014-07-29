;(function(undefined) {
  'use strict';

  /**
   * artoo initialization
   * =====================
   *
   * Launch artoo's init hooks.
   */
  var _root = this;

  // Script evaluation function
  function exec() {
    if (artoo.settings.eval) {
      artoo.log.verbose('evaluating and executing the script given to artoo.');
      eval.call(_root, JSON.parse(artoo.settings.eval));
    }
    else if (artoo.settings.scriptUrl) {
      artoo.log.verbose('executing script at "' +
                        artoo.settings.scriptUrl + '"');
      artoo.injectScript(artoo.settings.scriptUrl);
    }
  }

  // Initialization function
  function main() {

    // Triggering countermeasures
    artoo.hooks.trigger('countermeasures');

    // Welcoming user
    artoo.log.welcome();

    // Should we greet the user with a joyful beep?
    if (artoo.settings.log.beeping)
      artoo.beep();

    // Indicating we are injecting artoo from the chrome extension
    if (artoo.browser.chromeExtension)
      artoo.log.verbose('artoo has automatically been injected ' +
                        'by the chrome extension.');

    // Starting instructions recording
    if (artoo.settings.instructions.autoRecord)
      artoo.instructions.startRecording();

    // Injecting dependencies
    function injectJquery(cb) {
      artoo.jquery.inject(function() {

        // Applying jQuery plugins
        artoo.jquery.plugins.map(function(p) {
          p(artoo.$);
        });

        cb();
      });
    }

    artoo.helpers.parallel(
      [injectJquery, artoo.deps._inject],
      function() {
        artoo.log.info('artoo is now good to go!');

        // Triggering exec
        if (artoo.settings.autoExec)
          artoo.exec();

        // Triggering ready
        artoo.hooks.trigger('ready');
      }
    );

    // Updating artoo state
    artoo.loaded = true;
  }

  // Retrieving settings from script tag
  var dom = document.getElementById('artoo_injected_script');

  if (dom) {
    artoo.loadSettings(JSON.parse(dom.getAttribute('settings')));
    dom.parentNode.removeChild(dom);
  }

  // Updating artoo.browser
  artoo.browser.chromeExtension = !!artoo.settings.chromeExtension;

  // Adding functions to hooks
  artoo.hooks.init.unshift(main);
  artoo.hooks.exec.unshift(exec);

  // artoo initialization
  artoo.init = function() {
    artoo.hooks.trigger('init');
  };

  // artoo exectution
  artoo.exec = function() {
    artoo.hooks.trigger('exec');
  };

  // Init?
  if (artoo.settings.autoInit)
    artoo.init();
}).call(this);
