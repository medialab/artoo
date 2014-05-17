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
    chromeExtension: false,
    debug: false,
    gist: null,
    scriptUrl: null,
    eval: null,

    // Methods settings
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
    state: {
      key: '%artoo%'
    },
    store: {
      engine: 'local'
    }
  };
}).call(this);
