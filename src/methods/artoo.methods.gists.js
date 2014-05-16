;(function(undefined) {
  'use strict';

  /**
   * artoo Github Gists API abstraction
   * ===================================
   *
   * Utilities enabling the user to load and injects gist into his web page.
   */
  var _root = this,
      _cache = artoo.state.get('gists') || {};

  // Constants
  var apiEndpoint = 'https://api.github.com';

  // Namespace
  artoo.gists = {};

  // Utilities
  function isJsFile(filename) {
    return ~filename.indexOf('.js');
  }

  // Methods
  artoo.gists.browse = function(user) {
    user = user || artoo.settings.gists.user;

    if (!user) {
      artoo.log.error('No user specified. Cannot browse gists.');
      return;
    }

    return (_cache[user] || []).map(function(g) {
      return {
        description: g.description,
        files: g.files,
        id: g.id,
        created_at: g.created_at
      };
    });
  };

  artoo.gists.fetch = function(user, cb) {
    if (typeof user === 'function') {
      cb = user;
      user = undefined;
    }

    user = user || artoo.settings.gists.user;

    if (!user) {
      artoo.log.error('Impossible to fetch gists with no user.');
      return;
    }

    // Querying cache
    if (user in _cache) {
      if (typeof cb === 'function')
        cb(_cache[user]);
    }
    else {
      artoo.$.get(apiEndpoint + '/users/' + user + '/gists', function(gists) {

        // Caching
        _cache[user] = gists;

        // Caching in store?
        if (artoo.settings.gists.cache)
          artoo.state.set('gists', _cache);

        if (typeof cb === 'function')
          cb(gists);
      });
    }
  };

  artoo.gists.execute = function(user, params, cb) {
    params = (typeof user === 'object') ? user : (params || {});
    user = params.user || user || artoo.settings.gists.user;

    // Callbacks
    function noSuitableFile() {
      artoo.log.error('artoo was not able to find a suitable script with ' +
                      'the given parameters:', params);
    }

    function getFile(file) {

      // Injecting script
      artoo.injectScript(file.raw_url, cb);
    }

    // Safeguards
    if (!user ||
        (!params.description && !params.id && !params.filename)) {
      noSuitableFile();
      return;
    }

    var filter;
    if (params.id && params.filename)
      filter = function(e) {
        return e.id === params.id && e.filename in e.files;
      };
    else if (params.description && params.filename)
      filter = function(e) {
        return e.description === params.description && e.filename in e.files;
      };
    else if (params.id)
      filter = function(e) {
        return e.id === params.id;
      };
    else if (params.description)
      filter = function(e) {
        return e.description === params.description;
      };
    else
      filter = function(e) {
        return e.filename in e.files;
      };

    // Lazy load the gists
    artoo.helpers.lazy(
      user in _cache,
      function notInCache(next) {
        artoo.gists.fetch(user, next);
      },
      function() {
        var gist = artoo.helpers.first(_cache[user], filter),
            f;

        if (!gist) {
          noSuitableFile();
          return;
        }

        // Finding the most suitable script
        if (params.filename) {
          if (params.filename in gist.files)
            getFile(gist.files[params.filename]);
          else
            noSuitableFile();
        }
        else {
          f = artoo.helpers.first(Object.keys(gist.files), isJsFile);
          if (f)
            getFile(gist.files[f]);
          else
            noSuitableFile();
        }
      }
    );
  };
}).call(this);
