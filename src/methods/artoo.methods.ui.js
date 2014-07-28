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
    var id = 'artoo-ui' + (counter++);

    // Creating a host
    this.host = document.createElement('div');
    this.host.setAttribute('id', id);
    artoo.mountNode.appendChild(this.host);

    // Properties
    this.shadow = this.host.createShadowRoot();

    // Methods
    this.$ = function(sel) {
      return !sel ?
        artoo.$(this.shadow) :
        artoo.$(this.shadow).children(sel).add(
          artoo.$(this.shadow).children().find(sel)
        );
    };

    this.injectInlineStyle = function(style) {

      // Creating a style tag
      var e = document.createElement('style');
      e.innerText = style;

      // Appending to shadow
      this.shadow.appendChild(e);

      // Returning instance for chaining
      return this;
    };

    this.kill = function() {
      artoo.mountNode.removeChild(this.host);
      delete this.shadow;
      delete this.host;
    };
  };
}).call(this);
