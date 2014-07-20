;(function(undefined) {
  'use strict';

  /**
   * artoo sniffers
   * ===============
   *
   * A collection of listeners to monitor and hook some events on the host
   * webpage.
   */
  var _root = this;

  // Namespace
  artoo.sniffers = {};

  // Ajax sniffers
  //---------------

  // Persistent state
  // TODO: hook the get function to retrieve url and requests headers
  var ajaxRequestCallbacks = {},
      counter = 0,
      xhrSend = XMLHttpRequest.prototype.send,
      isXhrHooked = false;

  // Utilities
  function hookXhr() {
    if (isXhrHooked)
      return;

    XMLHttpRequest.prototype.send = function() {
      var curXhr = this,
          k;

      // TODO: how to bubble exception when this is executed through try except
      for (k in ajaxRequestCallbacks)
        ajaxRequestCallbacks[k](curXhr);

      xhrSend.apply(this, arguments);
    };

    isXhrHooked = true;
  }

  function resetXhr() {
    if (!isXhrHooked)
      return;

    XMLHttpRequest.prototype.send = xhrSend;
    isXhrHooked = false;
  }

  // A simple object designed to enable sniffers to be detached
  function AjaxSniffer(id) {

    // Properties
    this.id = id;

    // Methods
    this.detach = function() {
      delete ajaxRequestCallbacks[this.id];

      // If this is the last ajax sniffer, we reset xhr
      if (!Object.keys(ajaxRequestCallbacks).length)
        resetXhr();
    };
  }

  // Hook on ajax requests
  artoo.sniffers.ajaxRequest = function(fn) {
    if (typeof fn !== 'function')
      throw TypeError('artoo.sniffers.ajaxRequest:' +
                      'argument given is not a function.');

    // Hooking xhr
    hookXhr();

    // Adding the given function to callbacks
    var id = counter++;
    ajaxRequestCallbacks[id] = fn;

    // Returning a sniffer object
    return new AjaxSniffer(id);
  };

  // Hook on ajax results
  artoo.sniffers.ajaxComplete = function(fn) {
    if (typeof fn !== 'function')
      throw TypeError('artoo.sniffers.ajaxComplete:' +
                      'argument given is not a function.');

    return artoo.sniffers.ajaxRequest(function(xhr) {
      var originalFn = xhr.onreadystatechange;

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          fn(xhr);
        }

        if (typeof originalFn === 'function')
          originalFn.apply(xhr, arguments);
      };
    });
  };

  // Alias
  artoo.sn = artoo.sniffers;
}).call(this);
