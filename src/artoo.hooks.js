;(function(undefined) {
  'use strict';

  /**
   * artoo hooks
   * ============
   *
   * Utilities to triggers and apply artoo's hooks
   */
  var hooks = [
    'init',
    'countermeasures',
    'exec',
    'ready'
  ];

  artoo.hooks = {
    trigger: function(hook) {
      if (!artoo.hooks[hook])
        throw Error('artoo.hooks.trigger: inexistant hook');

      artoo.hooks[hook].forEach(function(fn) {
        fn.apply(artoo);
      });
    }
  };

  hooks.forEach(function(h) {
    artoo.hooks[h] = [];
  });

  // Add a function to be executed on the ready hook
  artoo.ready = function(fn) {
    if (typeof fn !== 'function')
      throw Error('artoo.ready: trying to register a non-function.');

    artoo.hooks.ready.push(fn);
  };
}).call(this);
