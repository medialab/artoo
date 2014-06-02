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
}).call(this);
