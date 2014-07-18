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
  var ajaxRequestCallbacks = [],
      xhrSend = XMLHttpRequest.prototype.send,
      hookedXhr = false;

  // Utilities
  function hookXhr() {
    if (hookedXhr)
      return;

    XMLHttpRequest.prototype.send = function() {
      var curXhr = this;

      ajaxRequestCallbacks.forEach(function(fn) {
        fn(curXhr);
      });

      xhrSend.apply(this, arguments);
    };
  }

  function resetXhr() {
    if (!hookedXhr)
      return;

    XMLHttpRequest.prototype.send = xhrSend;
  }

  // Hook on ajax requests
  // TODO: possibility to kill a sniffer
  artoo.sniffers.ajaxRequest = function(fn) {
    if (typeof fn !== 'function')
      throw TypeError('artoo.sniffers.ajaxRequest:' +
                      'argument given is not a function.');

    // Hooking xhr
    hookXhr();

    // Adding the given function to callbacks
    ajaxRequestCallbacks.push(fn);
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
