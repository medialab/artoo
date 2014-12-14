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

  // Methods
  artoo.bootstrap = function(cheerioInstance) {
    ['scrape', 'scrapeOne', 'scrapeTable'].forEach(function(m) {
      cheerioInstance.prototype[m] = function() {
        return artoo[m].apply(
          artoo, [artoo.$(this)].concat(Array.prototype.slice.call(arguments)));
      };
    });
  };

  artoo.bootstrap(cheerio);

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
