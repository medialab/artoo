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
    }
  };

  var mocks = [
    {
      url: '/basic/*',
      responseText: JSON.stringify(responses.basic)
    },
    {
      url: '/basic/4',
      responseText: JSON.stringify(responses.basicWithBreak)
    }
  ];

  // Registering mocks
  mocks.forEach(function(m) {
    $.mockjax(m);
  });

  // Testing ajax spiders
  asyncTest('Basic spider', function() {

    artoo.ajaxSpider(['/basic/1', '/basic/2'], function(data) {
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
            JSON.parse(data),
            responses.basic,
            'Next times iterator is run, data is correctly set.'
          );
        return '/basic/' + i;
      },
      {
        limit: 2,
        done: function(data) {
          start();

          deepEqual(
            data.map(JSON.parse),
            [responses.basic, responses.basic],
            'Crawling a with an iterator and a limit should stop properly.'
          );
        }
      }
    );
  });
}).call(this);
