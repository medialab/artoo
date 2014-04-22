;(function(undefined) {
  'use strict';

  /**
   * artoo core
   * ===========
   *
   * The main artoo namespace and its vital properties.
   */
  var _root = this;

  // Main object
  var Artoo = function(proxyName) {
    var _this = this;

    // Properties
    this.$ = null;
    this.version = '0.0.1';
    this.name = proxyName || 'artoo';
    this.passphrase = 'detoo';
    this.jquery = {
      version: '2.1.0',
      export: function() {
        _root.ß = _this.$;
      }
    };

    this.helpers = Artoo.helpers;

    this.init();
  };

  // Main prototype methods
  Artoo.prototype.init = function() {
    var _this = this;

    // Welcoming user
    this.welcome();

    // Injecting jQuery
    this.inject(function() {
      _this.log(_this.name + ' is now good to go!');
    });
  };

  if (typeof this.exports !== 'undefined') {
    if (typeof this.module !== 'undefined' && this.module.exports)
      this.exports = this.module.exports = Artoo;
    this.exports.Artoo = Artoo;
  }
  this.Artoo = Artoo;
}).call(this);
