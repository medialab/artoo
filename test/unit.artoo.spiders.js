;(function(undefined) {

  /**
   * artoo spiders unit tests
   * =========================
   *
   */
  module('artoo.spiders');

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

  // Testing ajax spiders
  asyncTest('Basic spider', function() {

    artoo.ajaxSpider(['/basictxt/1', '/basictxt/2'], function(data) {
      start();

      deepEqual(
        data.map(JSON.parse),
        [responses.basic, responses.basic],
        'Crawling a simple list should return the correct array.'
      );
    });
  });

  // Testing limit
  asyncTest('Spider limit', function() {
    expect(3);

    artoo.ajaxSpider(
      function(i, data) {
        if (i === 0)
          ok(data === undefined, 'First time iterator is run, data is undefined');
        else
          deepEqual(
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
          start();

          deepEqual(
            data,
            [responses.basic, responses.basic],
            'Crawling a with an iterator and a limit should stop properly.'
          );
        }
      }
    );
  });

  // Testing scrape helper
  asyncTest('Spider scraping', function() {
    expect(5);

    artoo.ajaxSpider(
      ['/html', '/html'],
      {
        scrape: {
          iterator: 'div',
          data: 'text'
        },
        done: function(data) {
          start();

          deepEqual(
            data,
            [['content1', 'content2'], ['content1', 'content2']],
            'Crawling with a scraper should return the correct array.'
          );
        }
      }
    );

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

          deepEqual(
            data,
            ['content1', 'content2', 'content1', 'content2'],
            'Crawling with a concat scraper should return the correct array, even when data is XML document.'
          );
        }
      }
    );

    artoo.ajaxSpider(
      function(i, $data) {
        if (i)
          ok(artoo.helpers.isSelector($data), 'Data given to iterator with jquerify is a valid selector.');
        return '/html';
      },
      {
        limit: 2,
        jquerify: true,
        callback: function($data, i)  {
          if (i)
            ok(artoo.helpers.isSelector($data), 'Data given to callbacks with jquerify is a valid selector.');
          return artoo.scrape($data.find('div'), 'id');
        },
        done: function(data) {

          deepEqual(
            data,
            [['div1', 'div2'], ['div1', 'div2']],
            'Crawling with a jquerify spider returns the correct array.'
          );
        }
      }
    );
  });
}).call(this);
