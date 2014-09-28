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

  // Applying helpers
  var methods = ['scrape', 'scrapeOne', 'scrapeTable'];

  methods.forEach(function(method) {

    cheerio.prototype[method] = function() {
      return artoo[method].apply(
        artoo, [artoo.$(this)].concat(Array.prototype.slice.call(arguments)));
    };
  });

  // Methods
  artoo.setContext = function($) {

    // Fixing context
    artoo.$ = $;
  };
}).call(this);



