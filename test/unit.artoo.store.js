;(function(undefined) {

  /**
   * artoo store methods unit tests
   * ===============================
   *
   */
  module('artoo.store', {

    // Deleting every localstorage item in case the tests failed
    teardown: function() {
      for (var i in localStorage)
        localStorage.removeItem(i);
    }
  });

  test('Setters & getters', function() {

    // Set some values
    artoo.s.set('number', 4);
    artoo.s.set('string', 'hello');
    artoo.s.set('numberLikeString', '45');
    artoo.s.set('array', [1, 2, 3]);
    artoo.s.set('object', {hello: 'world'});

    deepEqual(
      artoo.s.keys().length,
      5,
      'Getting keys should return the correct number of keys.'
    );

    strictEqual(
      artoo.s.get('number'),
      4,
      'Getting a number from store should return the correct type.'
    );

    strictEqual(
      artoo.s.get('string'),
      'hello',
      'Getting a string from store should return the correct type.'
    );

    strictEqual(
      artoo.s.get('numberLikeString'),
      '45',
      'Getting a string-like number from store should return the correct type.'
    );

    deepEqual(
      artoo.s.get('array'),
      [1, 2, 3],
      'Getting an array from store should return the correct type.'
    );

    deepEqual(
      artoo.s.get('object'),
      {hello: 'world'},
      'Getting an object from store should return the correct type.'
    );

    deepEqual(
      artoo.s.getAll(),
      {
        array: [
          1,
          2,
          3
        ],
        number: 4,
        numberLikeString: '45',
        object: {
          hello: 'world'
        },
        string: 'hello'
      },
      'Getting everything should return the correct object.'
    );

    deepEqual(
      artoo.s.pushTo('array', 4),
      [1, 2, 3, 4],
      'Pushing to a store array should return the correct new array.'
    );

    deepEqual(
      artoo.s.update('object', {yellow: 'blue'}),
      {hello: 'world', yellow: 'blue'},
      'Updating a store object should return the correct new object.'
    );

    deepEqual(
      artoo.s(),
      artoo.s.getAll(),
      's() and s.getAll achieve the same thing through polymorphism.'
    );

    deepEqual(
      artoo.s('object'),
      artoo.s.get('object'),
      's(key) and s.get(key) achieve the same thing through polymorphism.'
    );

    deepEqual(
      artoo.s.get(),
      artoo.s.getAll(),
      's.get without key and s.getAll achieve the same thing through polymorphism.'
    );

    artoo.store.remove('number');

    ok(
      artoo.s.keys().length === 4,
      'The store should be one item less if we remove one.'
    );

    deepEqual(
      null,
      artoo.s.get('number'),
      'Getting an inexistant item should return `null`.'
    );

    artoo.s.removeAll();

    ok(
      artoo.s.keys().length === 0,
      'Removing every items from the store should leave an empty store.'
    );
  });
}).call(this);
