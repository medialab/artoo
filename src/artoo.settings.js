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
    next: null,
    script: null,

    // Methods settings
    instructions: {
      autoRecord: true
    },
    jquery: {
      version: '2.1.1'
    },
    log: {
      enabled: true,
      level: 'verbose',
      beeping: false
    },
    gists: {
      user: null,
      store: true
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
