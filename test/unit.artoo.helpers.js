;(function(undefined) {

  /**
   * artoo helpers unit tests
   * =========================
   *
   */
  module('artoo.helpers');

  // Testing the some function
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

  test('first', function() {
    strictEqual(
      artoo.helpers.first([1, 2, 3], function(e) {
        return e === 2;
      }),
      2,
      'first should return the correct item in the array.'
    );

    strictEqual(
      artoo.helpers.first([1, 2, 3], function(e) {
        return e === 4;
      }),
      undefined,
      'first should return undefined if the item is not found in the array.'
    );
  });

  // Testing the toCSVString function
  test('toCSVString & parseCSVString', function() {
    var arrays = {
      correct: [['Michel', 'Chenu'], ['Marion', 'La brousse']],
      delimiter: [['Michel', 'Chenu, the Lord'], ['Marion', 'La brousse']],
      escape: [['Michel', 'Chenu'], ['Marion', 'dit "La brousse"']],
      badass: [['Michel', 'Chenu, the Lord'], ['Marion', 'dit "La brousse"']]
    };

    var strings = {
      correct: 'Michel,Chenu\nMarion,La brousse',
      delimiter: 'Michel,"Chenu, the Lord"\nMarion,La brousse',
      escape: 'Michel,Chenu\nMarion,"dit ""La brousse"""',
      badass: 'Michel,"Chenu, the Lord"\nMarion,"dit ""La brousse"""'
    };

    var headerArray = [
      {
        firstName: 'Michel',
        lastName: 'Chenu'
      },
      {
        firstName: 'Marion',
        lastName: 'La brousse'
      }
    ];

    var headerString = 'firstName,lastName\nMichel,Chenu\nMarion,La brousse';

    for (var i in arrays) {
      strictEqual(
        artoo.helpers.toCSVString(arrays[i]),
        strings[i],
        'The array "' + i + '" should return the correct string.'
      );
    }

    strictEqual(
      artoo.helpers.toCSVString(headerArray),
      headerString,
      'The array of object should return the correct string with headers.'
    );

    strictEqual(
      artoo.helpers.toCSVString([[1, 2], [3, 4]]),
      '1,2\n3,4',
      'Items other than number should not mess with CSV conversion.'
    );
  });
}).call(this);
