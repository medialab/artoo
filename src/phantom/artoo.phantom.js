;(function(undefined) {
  'use strict';

  /**
   * artoo phantom bridging
   * =======================
   *
   * Useful functions to send and receive data when spawned into a phantom.js
   * instance.
   */
  var _root = this,
      passphrase = 'detoo';

  // Safeguard
  if (!artoo.browser.phantomjs)
    throw Error('artoo.phantom: not in a phantom.js instance.');

  // Namespacing
  artoo.phantom = {};

  // Sending data to phantom
  artoo.phantom.send = function(head, body) {
    _root.callPhantom({head: head, body: body, passphrase: passphrase});
  };

  // Telling phantom the scraping is over
  artoo.phantom.done = function(data) {
    artoo.phantom.send('done', data);
  };

  // Alias
  artoo.done = artoo.phantom.done;
}).call(this);
