;(function(undefined) {

  /**
   * artoo spiders unit tests
   * =========================
   *
   */

  describe('artoo.ajaxSpider', function() {

    // Mock ajax responses
    var responses = {
      basic: {
        hello: 'world'
      },
      basicWithBreak: {
        hello: 'world',
        breaking: true
      },
      html: '<html><head></head><body><div id="div1">content1</div><div id="div2">content2</div></body></html>'
    };

    var mocks = [
      {
        url: '/basictxt/*',
        responseText: JSON.stringify(responses.basic)
      },
      {
        url: '/basic/*',
        dataType: 'json',
        responseText: responses.basic
      },
      {
        url: '/basic/4',
        dataType: 'json',
        responseText: responses.basicWithBreak
      },
      {
        url: '/basictxt/4',
        responseText: JSON.stringify(responses.basicWithBreak)
      },
      {
        url: '/html',
        responseText: responses.html
      },
      {
        url: '/xml',
        dataType: 'xml',
        responseXML: responses.html
      }
    ];

    // Registering mocks
    mocks.forEach(function(m) {
      $.mockjax(m);
    });

    it('should be possible to launch a basic spiders.', function(done) {
      artoo.ajaxSpider(['/basictxt/1', '/basictxt/2'], function(data) {

        assert.deepEqual(
          data.map(JSON.parse),
          [responses.basic, responses.basic]
        );
        done();
      });
    });

    it('should not crash when crawling an empty list.', function(done) {

      artoo.ajaxSpider([], function(data) {
        assert.deepEqual(
          data,
          []
        );
      });
      done();
    });

    it('should be possible to set limits to spiders.', function(done) {

      artoo.ajaxSpider(
        function(i, data) {
          if (i === 0)
            assert(data === undefined, 'First time iterator is run, data is undefined');
          else
            assert.deepEqual(
              data,
              responses.basic,
              'Next times iterator is run, data is correctly set.'
            );
          return '/basic/' + i;
        },
        {
          limit: 2,
          method: 'getJSON',
          done: function(data) {

            assert.deepEqual(
              data,
              [responses.basic, responses.basic],
              'Crawling a with an iterator and a limit should stop properly.'
            );
            done();
          }
        }
      );
    });

    it('should provide some scraping helpers.', function(done) {

      async.parallel({
        simpleScraper: function(next) {
          artoo.ajaxSpider(
            ['/html', '/html'],
            {
              scrape: {
                iterator: 'div',
                data: 'text'
              },
              done: function(data) {
                assert.deepEqual(
                  data,
                  [['content1', 'content2'], ['content1', 'content2']],
                  'Crawling with a scraper should return the correct array.'
                );
                next();
              }
            }
          );
        },
        xmlScraper: function(next) {
          artoo.ajaxSpider(
            ['/xml', '/xml'],
            {
              scrape: {
                iterator: 'div',
                data: 'text'
              },
              concat: true,
              settings: {
                dataType: 'xml',
                type: 'post'
              },
              done: function(data) {

                assert.deepEqual(
                  data,
                  ['content1', 'content2', 'content1', 'content2'],
                  'Crawling with a concat scraper should return the correct array, even when data is XML document.'
                );
                next();
              }
            }
          );
        },
        jquerify: function(next) {
          artoo.ajaxSpider(
            function(i, $data) {
              if (i)
                assert(artoo.helpers.isSelector($data), 'Data given to iterator with jquerify is a valid selector.');
              return '/html';
            },
            {
              limit: 2,
              jquerify: true,
              process: function($data, i)  {
                if (i)
                  assert(artoo.helpers.isSelector($data), 'Data given to callbacks with jquerify is a valid selector.');
                return artoo.scrape($data.find('div'), 'id');
              },
              done: function(data) {

                assert.deepEqual(
                  data,
                  [['div1', 'div2'], ['div1', 'div2']],
                  'Crawling with a jquerify spider returns the correct array.'
                );
                next();
              }
            }
          );
        }
      }, done);
    });
  });
}).call(this);
