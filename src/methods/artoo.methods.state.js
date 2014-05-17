;(function(undefined) {
  'use strict';

  /**
   * artoo persistent state
   * =======================
   *
   * artoo's persistent state abstraction. It populates itself if the state key
   * is present for the current page so the user might keep some data from page
   * to page.
   */
  var _root = this;

  // Getting artoo's state
  artoo.state = artoo.cache.register('artoo');
}).call(this);
