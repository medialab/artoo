;(function(undefined) {

  /**
   * artoo scrape method unit tests
   * ===============================
   *
   */

  describe('artoo.scrape', function() {

    it('basic list', function(done) {

      // Basic list scraping
      helpers.fetchHTMLResource('basic_list', function(id) {

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

        var titleList = [
          'Nice site',
          'Awesome site',
          'Pretty site',
          'Unknown site'
        ];

        // Testing
        assert.deepEqual(
          artoo.scrape(id + ' li > a', {
            url: {attr: 'href'},
            title: {method: 'text'}
          }),
          list,
          'Scraping the basic list should return the correct array of objects.'
        );

        assert.deepEqual(
          $(id + ' li > a').scrape({
            url: {attr: 'href'},
            title: {method: 'text'}
          }),
          list,
          'Scraping the basic list with the jQuery plugin should return the correct array of objects.'
        );

        assert.deepEqual(
          artoo.scrape(
            function($) {
              return $(id + ' li > a:first').add(id + ' li > a:last');
            }
          ),
          [titleList[0], titleList[3]],
          'Scraping the list with a function iterator should return the correct array of first and last elements.'
        );

        assert.deepEqual(
          artoo.scrape(id + ' li > a', {
            url: 'href',
            title: 'text'
          }),
          list,
          'Scraping the basic list should return the correct array of objects through polymorphism.'
        );

        assert.deepEqual(
          artoo.scrape(id + ' li > a', {
            url: function() {return $(this).attr('href');},
            title: function() {return $(this).text();}
          }),
          list,
          'Scraping the basic list with functions should return the correct array of objects.'
        );

        assert.deepEqual(
          artoo.scrape(id + ' li > a', {attr: 'href'}),
          simpleList,
          'Scraping only one property should return a correct array.'
        );

        assert.deepEqual(
          artoo.scrape(id + ' li > a', 'href'),
          simpleList,
          'Scraping only one property should return a correct array through polymorphism.'
        );

        assert.deepEqual(
          artoo.scrape(id + ' li > a'),
          titleList,
          'Scraping only one property with only first argument should return text.'
        );

        assert.deepEqual(
          artoo.scrape(id + ' li > a', function() { return $(this).attr('href'); }),
          simpleList,
          'Scraping only one property with a function should return a correct array.'
        );

        assert.deepEqual(
          artoo.scrape(id + ' li > a', function() { return $(this).attr('href'); }),
          simpleList,
          'Scraping only one property with a function should return a correct array.'
        );

        assert.deepEqual(
          artoo.scrape(id + ' li > a', function() { return $(this).attr('href'); }, {limit: 2}),
          simpleList.slice(0, 2),
          'Scraping with a limit should return only the first elements of the array.'
        );

        assert.deepEqual(
          artoo.scrapeOne(id + ' li > a', function() { return $(this).attr('href'); }),
          simpleList.slice(0, 1)[0],
          'Scraping only one item should return the correct element.'
        );

        assert.deepEqual(
          $(id + ' li > a').scrapeOne(function() { return $(this).attr('href'); }),
          simpleList.slice(0, 1)[0],
          'Scraping only one item with the jQuery plugin should return the correct element.'
        );

        done();
      });
    });

    it('complex list', function(done) {

      // Complex list scraping
      helpers.fetchHTMLResource('seachange', function(id) {

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

        assert.deepEqual(
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

        assert.deepEqual(
          artoo.scrape({
            iterator: '.views-row',
            data: {
              url: {
                sel: 'a',
                attr: 'href'
              },
              title: {
                sel: 'a',
                method: 'text'
              }
            }
          }),
          list,
          'Scraping the list with iterator polymorphism should also work.'
        );

        assert.deepEqual(
          artoo.scrape(id + ' .views-row', {
            url: {
              sel: 'a',
              method: function() {
                return $(this).attr('href');
              }
            },
            title: {
              sel: 'a',
              method: function() {
                return $(this).text();
              }
            }
          }),
          list,
          'Scraping the list with method polymorphism should return the correct array.'
        );

        assert.deepEqual(
          artoo.scrape(id + ' .views-row', {
            url: {
              sel: 'a',
              method: function() {
                return;
              },
              defaultValue: 'default value'
            },
            title: {
              sel: 'a',
              method: function() {
                return $(this).text();
              }
            }
          }),
          list.map(function(i) {
            return {
              title: i.title,
              url: 'default value'
            };
          }),
          'Scraping the list with default values should return the correct array.'
        );

        assert.deepEqual(
          artoo.scrapeOne(id + ' .views-row', {
            url: {
              sel: 'a',
              attr: 'href'
            },
            title: {
              sel: 'a',
              method: 'text'
            }
          }),
          list.slice(0, 1)[0],
          'Scraping one item should return the correct element.'
        );

        assert.deepEqual(
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

        done();
      });
    });

    it('recursive list', function(done) {

      helpers.fetchHTMLResource('recursive_list', function(id) {

        var result1 = [
          ['Item 1-1', 'Item 1-2'],
          ['Item 2-1', 'Item 2-2']
        ];

        var result2 = [
          {
            name: 'List 1',
            items: [
              {
                name: 'Foo',
                text: 'Item 1-1'
              },
              {
                name: 'Bar',
                text: 'Item 1-2'
              }
            ]
          },
          {
            name: 'List 2',
            items: [
              {
                name: 'Oof',
                text: 'Item 2-1'
              },
              {
                name: 'Rab',
                text: 'Item 2-2'
              }
            ]
          }
        ];

        assert.deepEqual(
          artoo.scrape(id + ' .recursive-url-list1 > li', {
            scrape: {
              iterator: 'ul > li',
              data: 'text'
            }
          }),
          result1,
          'Scraping the simple recursive list should return the correct array of arrays.'
        );

        assert.deepEqual(
          artoo.scrape(id + ' .recursive-url-list2 > li', {
            name: 'name',
            items: {
              scrape: {
                iterator: 'ul > li',
                data: {
                  name: 'name',
                  text: 'text'
                }
              }
            }
          }),
          result2,
          'Scraping the complex recursive list should return the correct items.'
        );

        done();
      });
    });

    it('recursive issue', function(done) {

      helpers.fetchHTMLResource('recursive_issue', function(id) {

        var result = {
          title: 'Title',
          items: ['Label 1', 'Label 2']
        };

        assert.deepEqual(
          artoo.scrapeOne(id + ' > ul', {
            title: {
              sel: 'li:first > span'
            },
            items: {
              sel: 'li:nth-child(2)',
              scrape: {
                iterator: 'span',
                data: 'text'
              }
            }
          }),
          result,
          'Scraping recursively should anchor on the correct selector.'
        );

        done();
      });
    });

    it('table', function(done) {

      helpers.fetchHTMLResource('table', function(id) {

        var flat = [
          ['Jill', 'Smith', '50'],
          ['Eve', 'Jackson', '94'],
          ['John', 'Doe', '80'],
          ['Adam', 'Johnson', '67']
        ];

        var objects = flat.map(function(p) {
          return {firstname: p[0], lastname: p[1], points: p[2]};
        });

        var customs = flat.map(function(p) {
          return {foo: p[0], bar: p[1], baz: p[2]};
        });

        assert.deepEqual(
          artoo.scrape(id + ' .reference tr:not(:first)', {
            scrape: {
              iterator: 'td',
              data: 'text'
            }
          }),
          flat,
          'Recursively scraping the table should return the correct array.'
        );

        assert.deepEqual(
          artoo.scrapeTable(id + ' .reference'),
          flat,
          'scrapTable should produce the same result as above.'
        );

        assert.deepEqual(
          $(id + ' .reference').scrapeTable(),
          flat,
          'Scraping a table with the jQuery plugin should work.'
        );

        assert.deepEqual(
          artoo.scrape(id + ' .reference tr:not(:first)', {
            firstname: {sel: 'td:first'},
            lastname: {sel: 'td:eq(1)'},
            points: {sel: 'td:eq(2)'}
          }),
          objects,
          'Scraping the list more easily should return the correct array of objects'
        );

        assert.deepEqual(
          artoo.scrapeTable(id + ' .reference', {headers: 'th'}),
          objects,
          'scrapTable with headers should produce the same result as above.'
        );

        assert.deepEqual(
          artoo.scrapeTable(id + ' .reference-no-headers', {headers: 'first'}),
          objects,
          'scrapTable with headers-first should produce the same result as above.'
        );

        assert.deepEqual(
          artoo.scrapeTable(id + ' .reference', {headers: ['foo', 'bar', 'baz']}),
          customs,
          'scrapTable with custom headers should produce the correct result.'
        );

        assert.deepEqual(
          artoo.scrapeTable(
            id + ' .reference-no-headers',
            {
              headers: {
                type: 'first',
                method: function() {
                  return $(this).text().toLowerCase();
                }
              }
            }),
          objects,
          'scrapTable with headers-first and header formatting should produce the same result as above.'
        );

        done();
      });
    });
  });
}).call(this);
