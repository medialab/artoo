;(function(undefined) {

  /**
   * artoo store methods unit tests
   * ===============================
   *
   */

  describe('artoo.store', function() {

    // Cleaning the store and setting some value before we begin
    before(function() {
      artoo.s.removeAll();

      artoo.s.set('number', 4);
      artoo.s.set('string', 'hello');
      artoo.s.set('numberLikeString', '45');
      artoo.s.set('array', [1, 2, 3]);
      artoo.s.set('object', {hello: 'world'});
    });

    // Deleting every localstorage item in case the tests failed
    after(function() {
      for (var i in localStorage)
        localStorage.removeItem(i);
    });

    describe('synchronous stores', function() {

      it('should be possible to retrieve the store\'s keys.', function() {
        assert.deepEqual(
          artoo.s.keys().length,
          5
        );
      });

      it('should be possible to get variable things from the store.', function() {
        assert.strictEqual(
          artoo.s.get('number'),
          4,
          'Getting a number from store should return the correct type.'
        );

        assert.strictEqual(
          artoo.s.get('string'),
          'hello',
          'Getting a string from store should return the correct type.'
        );

        assert.strictEqual(
          artoo.s.get('numberLikeString'),
          '45',
          'Getting a string-like number from store should return the correct type.'
        );

        assert.deepEqual(
          artoo.s.get('array'),
          [1, 2, 3],
          'Getting an array from store should return the correct type.'
        );

        assert.deepEqual(
          artoo.s.get('object'),
          {hello: 'world'},
          'Getting an object from store should return the correct type.'
        );

        assert.deepEqual(
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
      });

      it('should provide some useful helpers when dealing with non-scalar values.', function() {
        assert.deepEqual(
          artoo.s.pushTo('array', 4),
          [1, 2, 3, 4],
          'Pushing to a store array should return the correct new array.'
        );

        assert.deepEqual(
          artoo.s.update('object', {yellow: 'blue'}),
          {hello: 'world', yellow: 'blue'},
          'Updating a store object should return the correct new object.'
        );
      });

      it('should provide some handy polymorphisms.', function() {
        assert.deepEqual(
          artoo.s(),
          artoo.s.getAll(),
          's() and s.getAll achieve the same thing through polymorphism.'
        );

        assert.deepEqual(
          artoo.s('object'),
          artoo.s.get('object'),
          's(key) and s.get(key) achieve the same thing through polymorphism.'
        );

        assert.deepEqual(
          artoo.s.get(),
          artoo.s.getAll(),
          's.get without key and s.getAll achieve the same thing through polymorphism.'
        );
      });

      it('should be possible to remove items from the store.', function() {
        artoo.store.remove('number');

        assert(
          artoo.s.keys().length === 4,
          'The store should be one item less if we remove one.'
        );

        assert.deepEqual(
          null,
          artoo.s.get('number'),
          'Getting an inexistant item should return `null`.'
        );

        artoo.s.removeAll();

        assert(
          artoo.s.keys().length === 0,
          'Removing every items from the store should leave an empty store.'
        );
      });
    });

    describe('asynchronous stores', function() {
      var Mockup = new MockupAsynchronousStore(),
          asyncStore = artoo.createAsyncStore(Mockup.send);

      it('should be possible to set and get values.', function(done) {

        // Setting a value
        asyncStore.set('hello', 'world', function() {
          asyncStore.get('hello', function(data) {

            assert.strictEqual(data, 'world');
            done();
          });
        });
      });

      it('should be possible to retrieve the whole store.', function(done) {
        asyncStore.set('color', 'blue')
          .then(function() {
            assert(true, 'Promise polymorphism should work.');

            asyncStore.getAll()
              .then(function(data) {
                assert.deepEqual(
                  data,
                  {hello: 'world', color: 'blue'}
                );

                done();
              });
          });
      });

      it('should be possible to retrieve store\'s keys and remove items.', function(done) {

        // Removing the 'color' key
        asyncStore.remove('color', function() {

          // Retrieving remaining keys to check whether deletion worked
          asyncStore.keys(function(keys) {
            assert.deepEqual(
              keys,
              ['hello']
            );
          });

          done();
        });
      });

      it('should be possible to completely clear the store.', function(done) {
        asyncStore.removeAll()
          .then(function() {

            // Retrieving store to assert
            asyncStore()
              .then(function(store) {
                assert(!Object.keys(store).length);
                done();
              });
          });
      });
    });
  });
}).call(this);
