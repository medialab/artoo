;(function(undefined) {
  'use strict';

  /**
   * artoo compilation of chrome relevant methods
   * =============================================
   *
   * Useful to send data from the page context to an injected script and then
   * forward to the background script to store some persistent data.
   */
  var _root = this;

  // Namespace
  artoo.chrome = {};

  // Abstract
  artoo.chrome.send = function(header, data) {
    window.postMessage({
      passphrase: 'bip-bip',
      header: header || 'message',
      data: data
    }, '*');
  };
}).call(this);
