;(function(undefined) {
  'use strict';

  /**
   * artoo settings
   * ===============
   *
   * artoo settings that may be set by user.
   */
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
}).call(this);
