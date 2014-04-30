;(function(undefined) {
  'use strict';

  /**
   * artoo core
   * ===========
   *
   * The main artoo namespace and its vital properties.
   */
  var _root = this;

  // Checking preexistence of artoo and potential usurpation
  var exists = typeof _root.artoo !== 'undefined' ||
               typeof _root.detoo !== 'undefined',
      usurper = exists && _root.artoo.passphrase !== 'detoo',
      name;

  if (exists && !usurper) {
    console.log('An artoo already works within this page. ' +
                'No need to invoke another one.');
    return;
  }

  if (usurper)
    console.log('An usurper artoo lives within this page. Let\'s shun it!');

  // Main namespace
  var artoo = {
    $: {},
    version: '0.0.1',
    passphrase: 'detoo',
    dom: document.getElementById('artoo_injected_script'),
    loaded: false,
    hooks: {
      init: []
    },
    jquery: {
      version: '2.1.0',
      export: function() {
        _root.ß = artoo.$;
      }
    }
  };

  // Exporting to global scope
  if (typeof this.exports !== 'undefined') {
    if (typeof this.module !== 'undefined' && this.module.exports)
      this.exports = this.module.exports = artoo;
    this.exports.artoo = artoo;
  }
  this.artoo = artoo;
}).call(this);
