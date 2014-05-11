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
          url: 'href',
          title: 'text'
        }),
        [
          {url: 'http://nicesite.com', title: 'Nice site'},
          {url: 'http://awesomesite.com', title: 'Awesome site'},
          {url: 'http://prettysite.com', title: 'Pretty site'},
          {url: 'http://unknownsite.com', title: 'Unknown site'}
        ],
        'Scraping the basic list should return the correct array through polymorphism.'
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

      deepEqual(
        artoo.scrape(id + ' li > a', {attr: 'href'}),
        [
          'http://nicesite.com',
          'http://awesomesite.com',
          'http://prettysite.com',
          'http://unknownsite.com'
        ],
        'Scraping only one item should return a correct array.'
      );

      deepEqual(
        artoo.scrape(id + ' li > a', function() { return $(this).attr('href'); }),
        [
          'http://nicesite.com',
          'http://awesomesite.com',
          'http://prettysite.com',
          'http://unknownsite.com'
        ],
        'Scraping only one item with a function should return a correct array.'
      );
    });
  });
}).call(this);
