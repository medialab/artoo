;(function(undefined) {
  'use strict';

  /**
   * jQuery Injection
   * =================
   *
   * Checking whether a version of jquery lives in the targeted page
   * and gracefully inject it without generating conflicts.
   */
  artoo.jquery.inject = function(cb) {

    // Properties
    var desiredVersion = artoo.settings.jquery.version,
        cdn = '//code.jquery.com/jquery-' + desiredVersion + '.min.js';

    // Checking the existence of jQuery or of another library.
    var exists = typeof jQuery !== 'undefined',
        other = !exists && typeof $ === 'function',
        currentVersion = exists ? jQuery.fn.jquery : '0',
        chromeAPI = typeof $$ !== 'undefined' &&
          !!~$$.toString().indexOf('[Command Line API]');

    // jQuery is already in a correct mood
    if (exists && currentVersion.charAt(0) === desiredVersion.charAt(0)) {
      artoo.log.verbose('jQuery already exists in this page ' +
                        '(v' + currentVersion + '). No need to load it again.');

      // Internal reference
      artoo.$ = jQuery;
      artoo.jquery.setß();

      cb();
    }

    // Forcing jQuery injection, according to settings
    else if (artoo.settings.jquery.force) {
      artoo.injectScript(cdn, function() {
        artoo.log.warning('According to your settings, jQuery (v' +
                          desiredVersion + ') was injected into your page ' +
                          'to replace the current $ variable.');

        artoo.$ = jQuery;
        artoo.jquery.setß();

        cb();
      });
    }

    // jQuery has not the correct version or another library uses $
    else if ((exists && currentVersion.charAt(0) !== '2') || other) {
      artoo.injectScript(cdn, function() {
        artoo.log.warning(
          'Either jQuery has not a valid version or another library ' +
          'using $ is already present. ' +
          'Exporting correct version to ß (or artoo.$).');

        artoo.$ = jQuery.noConflict(true);
        artoo.jquery.setß();

        cb();
      });
    }

    // jQuery does not exist at all, we load it
    else {
      artoo.injectScript(cdn, function() {
        artoo.log.info('jQuery was correctly injected into your page ' +
                       '(v' + desiredVersion + ').');

        artoo.$ = jQuery;
        artoo.jquery.setß();

        cb();
      });
    }
  };
}).call(this);
