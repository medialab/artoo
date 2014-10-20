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
  var COUNTER = 0,
      INSTANCES = {};

  // Main Class
  artoo.ui = function(params) {
    params = params || {};

    var id = params.id || 'artoo-ui' + (COUNTER++);

    // Referencing the instance
    this.name = params.name || id;
    INSTANCES[this.name] = this;

    // Creating a host
    this.mountNode = params.mountNode || artoo.mountNode;
    this.host = document.createElement('div');
    this.host.setAttribute('id', id);
    this.mountNode.appendChild(this.host);

    // Properties
    this.shadow = this.host.createShadowRoot();

    // Methods
    function init() {
      var stylesheets = params.stylesheets || params.stylesheet;
      if (stylesheets) {
        (artoo.helpers.isArray(stylesheets) ?
          stylesheets : [stylesheets]).forEach(function(s) {
          this.injectStyle(s);
        }, this);
      }
    }

    this.$ = function(sel) {
      return !sel ?
        artoo.$(this.shadow) :
        artoo.$(this.shadow).children(sel).add(
          artoo.$(this.shadow).children().find(sel)
        );
    };

    this.injectStyle = function(name) {
      if (!(name in artoo.stylesheets))
        throw Error('artoo.ui.injectStyle: attempting to inject unknown ' +
                    'stylesheet (' + name +')');

      this.injectInlineStyle(artoo.stylesheets[name]);
    };

    this.injectInlineStyle = function(style) {

      // Creating a style tag
      var e = document.createElement('style');
      e.innerHTML = (artoo.helpers.isArray(style)) ?
        style.join('\n') :
        style;

      // Appending to shadow
      this.shadow.appendChild(e);

      // Returning instance for chaining
      return this;
    };

    this.kill = function() {
      this.mountNode.removeChild(this.host);
      delete this.shadow;
      delete this.host;
      delete INSTANCES[this.name];
    };

    // Initializing
    init.call(this);
  };

  // Instances accessor
  artoo.ui.instances = function(key) {
    return key ? INSTANCES[key] : INSTANCES;
  };
}).call(this);
