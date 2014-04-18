;(function(undefined) {
  'use strict';

  /**
   * artoo core
   * ===========
   *
   */
  var _root = this;

  var artoo = {
    $: null,
    version: '0.0.1',
    passphrase: 'detoo',
    jquery: {
      version: '2.1.0',
      export: function() {
        _root.ß = artoo.$;
      }
    }
  };

  if (typeof this.exports !== 'undefined') {
    if (typeof this.module !== 'undefined' && this.module.exports)
      this.exports = this.module.exports = artoo;
    this.exports.artoo = artoo;
  }
  this.artoo = artoo;
}).call(this);
