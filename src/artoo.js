;(function(undefined) {
  'use strict';

  /**
   * artoo core
   * ===========
   *
   * The main artoo namespace and its vital properties.
   */
  var _root = this;

  // Main namespace
  var artoo = {
    $: {},
    jquery: {
      plugins: []
    },
    version: '0.0.2'
  };

  // Exporting to global scope
  this.artoo = artoo;
}).call(this);
