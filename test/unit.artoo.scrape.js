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

      // Expected output
      var list = [
        {url: 'http://nicesite.com', title: 'Nice site'},
        {url: 'http://awesomesite.com', title: 'Awesome site'},
        {url: 'http://prettysite.com', title: 'Pretty site'},
        {url: 'http://unknownsite.com', title: 'Unknown site'}
      ];

      var simpleList = [
        'http://nicesite.com',
        'http://awesomesite.com',
        'http://prettysite.com',
        'http://unknownsite.com'
      ];

      // Testing
      deepEqual(
        artoo.scrape(id + ' li > a', {
          url: {attr: 'href'},
          title: {method: 'text'}
        }),
        list,
        'Scraping the basic list should return the correct array of objects.'
      );

      deepEqual(
        artoo.scrape(id + ' li > a', {
          url: 'href',
          title: 'text'
        }),
        list,
        'Scraping the basic list should return the correct array of objects through polymorphism.'
      );

      deepEqual(
        artoo.scrape(id + ' li > a', {
          url: function() {return $(this).attr('href');},
          title: function() {return $(this).text();}
        }),
        list,
        'Scraping the basic list with functions should return the correct array of objects.'
      );

      deepEqual(
        artoo.scrape(id + ' li > a', {attr: 'href'}),
        simpleList,
        'Scraping only one property should return a correct array.'
      );

      deepEqual(
        artoo.scrape(id + ' li > a', 'href'),
        simpleList,
        'Scraping only one property should return a correct array through polymorphism.'
      );

      deepEqual(
        artoo.scrape(id + ' li > a', function() { return $(this).attr('href'); }),
        simpleList,
        'Scraping only one property with a function should return a correct array.'
      );

      deepEqual(
        artoo.scrape(id + ' li > a', function() { return $(this).attr('href'); }),
        simpleList,
        'Scraping only one property with a function should return a correct array.'
      );

      deepEqual(
        artoo.scrape(id + ' li > a', function() { return $(this).attr('href'); }, {limit: 2}),
        simpleList.slice(0, 2),
        'Scraping with a limit should return only the first elements of the array.'
      );
    });
  });

  asyncTest('Complex list', function() {

    // Complex list scraping
    helpers.fetchHTMLResource('seachange', function(id) {
      start();

      // Expected output
      var list = [
        {
          title: 'Syria Evaluation Portal for Coordinated Accountability and Lessons Learning (CALL)',
          url: 'http://www.syrialearning.org/'
        },
        {
          title: 'Action Research on Community Adaptation in Bangladesh (ARCAB)',
          url: 'http://www.arcab.org/'
        },
        {
          title: 'Active Learning Network for Accountability and Performance in humanitarian action (ALNAP)',
          url: 'http://www.alnap.org/'
        }
      ];

      deepEqual(
        artoo.scrape(id + ' .views-row', {
          url: {
            sel: 'a',
            attr: 'href'
          },
          title: {
            sel: 'a',
            method: 'text'
          }
        }),
        list,
        'Scraping the list should return the correct array.'
      );

      deepEqual(
        artoo.scrape(id + ' .views-row', {
          url: function() {
            return $(this).find('a').attr('href');
          },
          title: function() {
            return $(this).find('a').text();
          }
        }),
        list,
        'Scraping the list with functions should return the correct array.'
      );
    });
  });
}).call(this);
