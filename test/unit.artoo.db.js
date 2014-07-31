;(function(undefined) {

  /**
   * artoo indexedDB unit tests
   * ===========================
   *
   */

  // Not testing indexedDB in phantomjs due to lack of support
  if (artoo.browser.phantomjs)
    return;

  module('artoo.db');

  asyncTest('Database functions', function() {
    expect(5);

    artoo.db.clear(function(err) {
      creating();
    });

    // Creating the database
    function creating()  {
      artoo.db('test', function(c) {
        start();
        ok(c.name === 'test', 'Collection is correctly created.');
        adding(c);
      });
    }

    // Adding an element
    function adding(c) {
      c.add({hello: 'world'}, function(err, key) {
        ok(!err, 'No error is invoked when data is added.');
        ok(key === 1, 'The first key is correctly provided.');
        getByIndex(c);
      });
    }

    // Getting an element through its key
    function getByIndex(c) {
      c.get(1, function(err, item) {
        ok(!err, 'No error is invoked when data is retrieved by index.');
        deepEqual(item, {hello: 'world', id: 1}, 'Correct data is retrieved.');
        tearDown();
      });
    }

    // Teardown
    function tearDown() {
      artoo.db.clear();
    }
  });
}).call(this);
