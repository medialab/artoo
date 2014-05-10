;(function(undefined) {

  /**
   * artoo scrape method unit tests
   * ===============================
   *
   */
  module('artoo.scrape');

  asyncTest('Basic list', function() {

    // Basic list scraping
    helpers.fetchHTMLResource('basic_list', function(id) {
      start();

      // Testing
      deepEqual(
        artoo.scrape(id + ' li > a', {
          url: {attr: 'href'},
          title: {method: 'text'}
        }),
        [
          {url: 'http://nicesite.com', title: 'Nice site'},
          {url: 'http://awesomesite.com', title: 'Awesome site'},
          {url: 'http://prettysite.com', title: 'Pretty site'},
          {url: 'http://unknownsite.com', title: 'Unknown site'}
        ],
        'Scraping the basic list should return the correct array.'
      );

      deepEqual(
        artoo.scrape(id + ' li > a', {
          url: function() {return $(this).attr('href');},
          title: function() {return $(this).text();}
        }),
        [
          {url: 'http://nicesite.com', title: 'Nice site'},
          {url: 'http://awesomesite.com', title: 'Awesome site'},
          {url: 'http://prettysite.com', title: 'Pretty site'},
          {url: 'http://unknownsite.com', title: 'Unknown site'}
        ],
        'Scraping the basic list with functions should return the correct array.'
      );
    });
  });
}).call(this);
