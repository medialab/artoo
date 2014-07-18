;(function(undefined) {
  'use strict';

  /**
   * artoo dependencies
   * ===================
   *
   * Gracefully inject popular dependencies into the scraped webpage.
   */
  var _root = this;

  artoo.deps = {};

  var supported = {
    async: {
      url: '//cdnjs.cloudflare.com/ajax/libs/async/0.9.0/async.js',
      variable: 'async'
    },
    lodash: {
      url: '//cdn.jsdelivr.net/lodash/2.4.1/lodash.min.js',
      variable: '_'
    },
    underscore: {
      url: '//cdn.jsdelivr.net/underscorejs/1.6.0/underscore-min.js',
      variable: '_'
    }
  };

  // Dependencies injection routine
  artoo.deps.inject = function(cb) {
    var deps = artoo.settings.dependencies;

    if (!deps.length)
      return cb();

    artoo.log.verbose('Starting to retrieve dependencies...', deps);

    var tasks = deps.map(function(d) {
      var name = (typeof d === 'string') ? d : d.name,
          url = d.url || supported[name].url;

      if (!(name in supported)) {
        throw Error('Trying to load an unsupported dependency: ' + name);
      }

      return function(taskCb) {
        var variable = supported[name].variable,
            exists = variable in _root;

        artoo.injectScript(url, function() {
          if (exists) {
            artoo.log.warning(name + ' already exists within your page. By ' +
                              'precaution, artoo stashed it under artoo.deps.' +
                              variable);

            artoo.deps[variable] = _root[variable].noConflict();
            return taskCb();
          }

          artoo.log.info(name + ' was correctly injected into your page.');
          artoo.deps[variable] = _root[variable];
          taskCb();
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
    var exists = typeof jQuery !== 'undefined',
        other = !exists && typeof $ === 'function',
        currentVersion = exists && jQuery.fn.jquery ? jQuery.fn.jquery : '0';

    // jQuery is already in a correct mood
    if (exists && currentVersion.charAt(0) === desiredVersion.charAt(0)) {
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
