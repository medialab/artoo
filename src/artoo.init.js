;(function(undefined) {
  'use strict';

  /**
   * artoo initialization
   * =====================
   *
   * artoo's inititialization routine.
   */
  var _root = this;

  // Script evaluation function
  var firstExec = true;
  function exec() {

    // Should we reExec?
    if (!artoo.settings.reExec && !firstExec) {
      artoo.log.warning('not reexecuting script as per settings.');
      return;
    }

    // Evaluating or invoking distant script?
    if (artoo.settings.eval) {
      artoo.log.verbose('evaluating and executing the script given to artoo.');
      eval.call(_root, JSON.parse(artoo.settings.eval));
    }
    else if (artoo.settings.scriptUrl) {
      artoo.log.verbose('executing script at "' +
                        artoo.settings.scriptUrl + '"');
      artoo.injectScript(artoo.settings.scriptUrl);
    }

    firstExec = false;
  }

  // Initialization function
  function main() {

    // Triggering countermeasures
    artoo.emit('countermeasures');

    // Welcoming user
    if (artoo.settings.log.welcome)
      artoo.log.welcome();

    // Should we greet the user with a joyful beep?
    var beeping = artoo.settings.log.beeping;
    if (beeping)
      artoo.beep.greet();

    // Indicating we are injecting artoo from the chrome extension
    if (artoo.browser.chromeExtension)
      artoo.log.verbose('artoo has automatically been injected ' +
                        'by the chrome extension.');

    // If in phantom, dependencies are loaded synchronously
    if (artoo.browser.phantomjs) {
      artoo.$ = window.artooPhantomJQuery;
      delete window.artooPhantomJQuery;
      artoo.jquery.applyPlugins();
      return artoo.emit('ready');
    }


    // Injecting dependencies
    function injectJquery(cb) {
      artoo.jquery.inject(function() {

        // Applying jQuery plugins
        artoo.jquery.applyPlugins();

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
        artoo.emit('ready');
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
  artoo.once('init', main);
  artoo.on('exec', exec);

  // artoo initialization
  artoo.init = function() {
    artoo.emit('init');
  };

  // artoo exectution
  artoo.exec = function() {
    artoo.emit('exec');
  };

  // Init?
  if (artoo.settings.autoInit)
    artoo.init();
}).call(this);
