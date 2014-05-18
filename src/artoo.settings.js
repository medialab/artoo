;(function(undefined) {
  'use strict';

  /**
   * artoo settings
   * ===============
   *
   * artoo default settings that user may override.
   */

  // Defaults
  artoo.settings = {

    // Root settings
    autoInit: true,
    autoExec: true,
    chromeExtension: false,
    debug: false,
    gist: null,
    scriptUrl: null,
    eval: null,
    reload: false,

    // Methods settings
    cache: {
      delimiter: '%'
    },
    instructions: {
      autoRecord: true
    },
    jquery: {
      version: '2.1.1',
      force: false,
      ß: true
    },
    log: {
      enabled: true,
      level: 'verbose',
      beeping: false
    },
    gists: {
      user: null,
      cache: true
    },
    navigation: {
      history: true
    },
    store: {
      engine: 'local'
    }
  };

  // Setting utility
  artoo.loadSettings = function(ns) {
    var s = artoo.settings,
        k;

    if (ns) {
      for (k in ns) {
        if (artoo.helpers.isPlainObject(ns[k]))
          s[k] = artoo.helpers.extend(ns[k], s[k]);
        else
          s[k] = ns[k];
      }
    }
  };
}).call(this);
