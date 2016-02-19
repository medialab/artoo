;(function(undefined) {
  'use strict';

  /**
   * artoo helpers
   * ==============
   *
   * Replacing some helpers by their node.js counterparts.
   */
  var _root = this;

  // False function
  artoo.helpers.isDocument = function(v) {
    return false;
  };

  // Is this a cheerio selector?
  artoo.helpers.isSelector = function(v) {
    return !!(v && v.prototype && v.prototype.cheerio &&
              v.prototype.cheerio === '[cheerio object]') ||
           !!(v._root && v.options && 'normalizeWhitespace' in v.options);
  };
}).call(this);
