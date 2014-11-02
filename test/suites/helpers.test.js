;(function(undefined) {

  /**
   * artoo helpers unit tests
   * =========================
   *
   */
  describe('artoo.helpers', function() {

    describe('first', function() {

      it('should return the correct item in the array.', function() {
        assert.strictEqual(
          artoo.helpers.first([1, 2, 3], function(e) {
            return e === 2;
          }),
          2
        );
      });

      it('should return undefined if the item were not to be found.', function() {
        assert.strictEqual(
          artoo.helpers.first([1, 2, 3], function(e) {
            return e === 4;
          }),
          undefined
        );
      });
    });

    describe('indexOf', function() {
      var a = [
        {name: 'John'},
        {name: 'Patrick'}
      ];

      it('should return the correct index if the item exists.', function() {
        assert.strictEqual(
          artoo.helpers.indexOf(a, function(i) {
            return i.name === 'Patrick';
          }),
          1
        );
      });

      it('should return -1 if the item were not to be found.', function() {
        assert.strictEqual(
          artoo.helpers.indexOf(a, function(i) {
            return i.name === 'Jack';
          }),
          -1
        );
      });
    });

    describe('before', function() {
      it('should run the given function before the original one.', function() {
        var count = 0;

        var targetFunction = function() {
          count++;
          return 'ok';
        };

        // Monkey patching
        var newFunction = artoo.helpers.before(targetFunction, function() {
          count++;
        });

        assert.strictEqual(newFunction(), 'ok');
        assert.strictEqual(count, 2);
      });
    });
  });
}).call(this);
