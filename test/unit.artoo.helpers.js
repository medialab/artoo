;(function(undefined) {

  /**
   * artoo helpers unit tests
   * =========================
   *
   */
  module('artoo.helpers');

  test('some', function() {
    ok(
      artoo.helpers.some([1, 2, 3], function(e) {
        return e === 2;
      }),
      'some should return true if relevant item is in the array.'
    );

    ok(
      !artoo.helpers.some([1, 2, 3], function(e) {
        return e === 4;
      }),
      'some should return false if relevant item is not in the array.'
    );
  });
}).call(this);
