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
    env: 'dev',
    eval: null,
    reExec: true,
    reload: false,
    scriptUrl: null,

    // Methods settings
    beep: {
      endpoint: '//medialab.github.io/artoo/sounds/'
    },
    cache: {
      delimiter: '%'
    },
    dependencies: [],
    jquery: {
      version: '2.1.3',
      force: false
    },
    log: {
      beeping: false,
      enabled: true,
      level: 'verbose',
      welcome: true
    },
    store: {
      engine: 'local'
    }
  };

  // Setting utility
  artoo.loadSettings = function(ns) {
    artoo.settings = artoo.helpers.extend(ns, artoo.settings);
  };
}).call(this);
