;(function(undefined) {
  'use strict';

  /**
   * artoo core
   * ===========
   *
   * The main artoo namespace and its vital properties.
   */

  // Checking whether a body exists
  var body;
  if ('document' in this) {
    body = document.getElementsByTagName('body')[0];
    if (!body) {
      body = document.createElement('body');
      document.firstChild.appendChild(body);
    }
  }

  var artoo = {
    $: {},
    jquery: {
      plugins: []
    },
    mountNode: body,
    stylesheets: {},
    templates: {}
  };

  // Non-writable version
  Object.defineProperty(artoo, 'version', {
    value: '0.2.0'
  });

  // Exporting to global scope
  this.artoo = artoo;
}).call(this);
