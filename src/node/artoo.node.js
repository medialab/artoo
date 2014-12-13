;(function(undefined) {
  'use strict';

  /**
   * artoo Node.js utilities
   * ========================
   *
   * Some useful utilities when using artoo.js within node.
   */
  var cheerio = require('cheerio'),
      path = require('path');

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

  // Giving paths to alternative lib versions so they can be used afterwards
  artoo.paths = {
    browser: path.join(__dirname, 'artoo.concat.js'),
    chrome: path.join(__dirname, 'artoo.chrome.js'),
    phantom: path.join(__dirname, 'artoo.phantom.js')
  };
}).call(this);



