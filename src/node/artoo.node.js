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
  artoo.paths = {};

  var versions = ['chrome', 'phantom'];
  versions.forEach(function(v) {
    artoo.paths[v] = path.join(__dirname, 'artoo.' + v + '.js')
  });
}).call(this);



