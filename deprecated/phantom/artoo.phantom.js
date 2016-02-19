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

  // Phantom notifying something to us
  artoo.phantom.notify = function(head, body) {
    artoo.emit('phantom:' + head, body);
  };

  // Killing phantom from the page for testing purposes
  artoo.phantom.exit = function(code) {
    artoo.phantom.send('exit', code);
  };

  // Streaming data to phantom
  artoo.phantom.stream = function(data) {
    artoo.phantom.send('stream', data);
  };

  // Telling phantom the scraping is over
  artoo.phantom.done = function(err, data) {
    artoo.phantom.send('done', {error: err, data: data});
  };

  // Alias
  artoo.done = artoo.phantom.done;
}).call(this);
