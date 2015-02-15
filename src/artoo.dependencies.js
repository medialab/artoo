;(function(undefined) {
  'use strict';

  /**
   * artoo dependencies
   * ===================
   *
   * Gracefully inject popular dependencies into the scraped webpage.
   */
  var _root = this,
      _cached = {};

  artoo.deps = {};

  // Dependencies injection routine
  // TODO: trust and function to check version and such
  artoo.deps._inject = function(cb) {
    var deps = artoo.settings.dependencies;

    if (!deps.length)
      return cb();

    artoo.log.verbose(
      'Starting to retrieve dependencies...',
      deps.map(function(d) {
        return d.name;
      })
    );

    // Creating tasks
    var tasks = deps.map(function(d) {
      if (!d.name || !d.globals || !d.url)
        throw Error('artoo.deps: invalid dependency definition.');

      // Computing globals
      var globals = typeof d.globals === 'string' ? [d.globals] : d.globals;
      globals.forEach(function(g) {

          // Is the variable present in the global scope?
          if (_root[g] && !d.noConflict && !d.force)
            _cached[g] = _root[g];
      });

      // Creating a task
      return function(next) {

        // Script injection
        artoo.injectScript(d.url, function() {

          // Announcing
          artoo.log.verbose('Retrieved dependency ' + d.name + '.');

          // Retrieving the variables under artoo.deps
          var retrievedGlobals = {};
          globals.forEach(function(g) {

            retrievedGlobals[g] = _root[g];

            // If cached and not forced
            if (_cached[g]) {
              _root[g] = _cached[g];
              delete _cached[g];
            }

            // If noConflict and not forced
            if (d.noConflict)
              _root[g].noConflict();
          });

          // Assigning to deps
          artoo.deps[d.name] = Object.keys(retrievedGlobals).length > 1 ?
            retrievedGlobals :
            retrievedGlobals[Object.keys(retrievedGlobals)[0]];

          next();
        });
      };
    });

    artoo.helpers.parallel(tasks, function() {
      artoo.log.verbose('Finished retrieving dependencies.');
      cb();
    });
  };

  // jQuery injection routine
  artoo.jquery.inject = function(cb) {

    // Properties
    var desiredVersion = artoo.settings.jquery.version,
        cdn = '//code.jquery.com/jquery-' + desiredVersion + '.min.js';

    // Checking the existence of jQuery or of another library.
    var exists = (typeof jQuery !== 'undefined' && jQuery.fn) || artoo.$.fn,
        other = !exists && typeof $ !== 'undefined',
        currentVersion = exists && jQuery.fn.jquery ? jQuery.fn.jquery : '0';

    // jQuery is already in a correct mood
    if (exists &&
        currentVersion.charAt(0) === desiredVersion.charAt(0) &&
        currentVersion.charAt(2) === desiredVersion.charAt(2)) {
      artoo.log.verbose('jQuery already exists in this page ' +
                        '(v' + currentVersion + '). No need to load it again.');

      // Internal reference
      artoo.$ = jQuery;

      cb();
    }

    // Forcing jQuery injection, according to settings
    else if (artoo.settings.jquery.force) {
      artoo.injectScript(cdn, function() {
        artoo.log.warning('According to your settings, jQuery (v' +
                          desiredVersion + ') was injected into your page ' +
                          'to replace the current $ variable.');

        artoo.$ = jQuery;

        cb();
      });
    }

    // jQuery has not the correct version or another library uses $
    else if ((exists && currentVersion.charAt(0) !== '2') || other) {
      artoo.injectScript(cdn, function() {
        artoo.$ = jQuery.noConflict(true);

        // Then, if dollar does not exist, we set it
        if (typeof _root.$ === 'undefined') {
          _root.$ = artoo.$;

          artoo.log.warning(
            'jQuery is available but does not have a correct version. ' +
            'The correct version was therefore injected and $ was set since ' +
            'it was not used.'
          );
        }
        else {
          artoo.log.warning(
            'Either jQuery has not a valid version or another library ' +
            'using $ is already present. ' +
            'Correct version available through `artoo.$`.'
          );
        }

        cb();
      });
    }

    // jQuery does not exist at all, we load it
    else {
      artoo.injectScript(cdn, function() {
        artoo.log.info('jQuery was correctly injected into your page ' +
                       '(v' + desiredVersion + ').');

        artoo.$ = jQuery;

        cb();
      });
    }
  };
}).call(this);
