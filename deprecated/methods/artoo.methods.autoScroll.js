;(function(undefined) {
  'use strict';

  /**
   * artoo autoScroll methods
   * =========================
   *
   * Some useful functions to scroll programmatically the web pages you need
   * to scrape.
   */
  var _root = this;

  artoo.autoScroll = function(params, cb) {
    artoo.autoExpand(
      this.helpers.extend(params, {
        expand: function() {
          window.scrollTo(0, document.body.scrollHeight);
        }
      }),
      cb
    );
  };
}).call(this);
