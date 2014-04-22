;(function(undefined) {
  'use strict';

  /**
   * jQuery Injection
   * =================
   *
   * Checking whether a version of jquery lives in the targeted page
   * and gracefully inject it without generating conflicts.
   */

  Artoo.prototype.inject = function(cb) {
    var _this = this;

    // Properties
    var desiredVersion = this.jquery.version,
        cdn = '//code.jquery.com/jquery-' + desiredVersion + '.min.js';

    // Checking the existence of jQuery or of another library.
    var exists = typeof jQuery !== 'undefined',
        other = !exists && typeof $ === 'function',
        currentVersion = exists ? jQuery.fn.jquery : '0',
        chromeAPI = typeof $$ !== 'undefined' &&
          !!~$$.toString().indexOf('[Command Line API]');

    // jQuery is already in a correct mood
    if (exists && currentVersion.charAt(0) === '2') {
      this.log('jQuery already exists in this page ' +
                '(v' + currentVersion + '). No need to load it again.');

      // Internal reference
      this.$ = jQuery;

      cb();
    }

    // jQuery has not the correct version or another library uses $
    else if ((exists && currentVersion.charAt(0) !== '2') || other) {
      this.getScript(cdn, function() {
        _this.log(
          'Either jQuery has not a valid version or another library ' +
          'using dollar is already present.\n' +
          'Exporting correct version to ß (or ' + _this.name + '.$).');

        _this.$ = jQuery.noConflict();
        _this.jquery.export();

        cb();
      });
    }

    // jQuery does not exist at all, we load it
    else {
      this.getScript(cdn, function() {
        _this.log(_this.name + ' loaded jQuery into your page ' +
                  '(v' + desiredVersion + ').');

        _this.$ = jQuery;

        cb();
      });
    }
  };
}).call(this);
