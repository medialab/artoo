;(function(undefined) {
  'use strict';

  /**
   * artoo Node.js utilities
   * ========================
   *
   * Some useful utilities when using artoo.js within node.
   */
  var cheerio = require('cheerio');

  // Setting initial context
  artoo.$ = cheerio.load('');

  // Methods
  artoo.setContext = function($) {
    artoo.$ = $;
  };
}).call(this);
