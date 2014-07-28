;(function(undefined) {
  'use strict';

  /**
   * artoo ui
   * =========
   *
   * A handy utility to create shadow DOM interfaces on the fly.
   */
  var _root = this;

  // Persistent state
  var counter = 0;

  artoo.ui = function() {
    var id = 'bacta-tank' + (counter++);

    // Creating a host
    var host = document.createElement('div');
    host.setAttribute('id', id);
    artoo.mountNode.appendChild(host);

    // Properties
    this.host = host;
    this.shadow = host.createShadowRoot();

    // Methods
    this.$ = function(sel) {
      return !sel ? $(this.shadow) : $(this.shadow).contents(sel);
    };
  };
}).call(this);
