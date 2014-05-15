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
    store: {
      engine: 'local'
    },
    log: {
      enabled: true,
      level: 'verbose'
    },
    instructions: {
      record: true
    },
    jquery: {
      version: '2.1.1'
    }
  };
}).call(this);
