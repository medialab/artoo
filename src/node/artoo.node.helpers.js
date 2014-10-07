;(function(undefined) {
  'use strict';

  /**
   * artoo helpers
   * ==============
   *
   * Replacing some helpers by their node.js counterparts.
   */
  var _root = this,
      cheerio = require('cheerio');

  // False function
  artoo.helpers.isDocument = function(v) {
    return false;
  };

  // Is this a cheerio selector?
  artoo.helpers.isSelector = function(v) {
    return v instanceof cheerio;
  };
}).call(this);
