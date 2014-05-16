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
      artoo.log.error('Impossible to fetch gists if you do not specify a user.');
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
        if (artoo.settings.gists.store)
          artoo.state.set('gists', _cache);

        if (typeof cb === 'function')
          cb(gists);
      });
    }
  };

  artoo.gists.execute = function(params, cb) {
    params = params || {};
    var filter,
        gist;

    user = user || artoo.settings.gists.user;
    if (!user) {
      artoo.log.error('Impossible to execute a gist if you do not specify its' +
                      ' creator.');
      return;
    }

    if (!params.description && !params.id && !params.filename) {
      artoo.log.error('Impossible to execute a gist with given parameters :',
                      params);
      return;
    }

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

    // gist = artoo.helpers.first(_cache)
    // ext = .js par defaut over another
  };
}).call(this);
