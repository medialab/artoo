;(function(undefined) {

  /**
   * artoo helpers unit tests
   * =========================
   *
   */
  module('artoo.helpers');

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
  test('toCSVString', function() {
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
      badass: 'Michel,"Chenu, the Lord"\nMarion,"dit ""La brousse"""',
      tsv: 'Michel\tChenu\nMarion\tLa brousse',
      customEscape: 'Michel,|Chenu, the Lord|\nMarion,La brousse'
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

    var headerString = 'firstName,lastName\nMichel,Chenu\nMarion,La brousse',
        customString = 'one,two\nMichel,Chenu\nMarion,La brousse';

    for (var i in arrays) {
      strictEqual(
        artoo.helpers.toCSVString(arrays[i]),
        strings[i],
        'The array "' + i + '" should return the correct string.'
      );
    }

    strictEqual(
      artoo.helpers.toCSVString(arrays.correct, {delimiter: '\t'}),
      strings.tsv,
      'The array should return a string with the wanted delimiter.'
    );

    strictEqual(
      artoo.helpers.toCSVString(arrays.delimiter, {escape: '|'}),
      strings.customEscape,
      'The array should return a string with the wanted escape character.'
    );

    strictEqual(
      artoo.helpers.toCSVString(headerArray),
      headerString,
      'The array of object should return the correct string with headers.'
    );

    strictEqual(
      artoo.helpers.toCSVString(headerArray, {headers: false}),
      strings.correct,
      'The array of object should return the correct string without headers if we do not want them.'
    );

    strictEqual(
      artoo.helpers.toCSVString(arrays.correct, {headers: ['one', 'two']}),
      customString,
      'The array of arrays should return the correct string with custom headers.'
    );

    strictEqual(
      artoo.helpers.toCSVString(headerArray, {headers: ['one', 'two']}),
      customString,
      'The array of object should return the correct string with custom headers.'
    );

    strictEqual(
      artoo.helpers.toCSVString([[1, 2], [3, 4]]),
      '1,2\n3,4',
      'Items other than strings should not mess with CSV conversion.'
    );
  });
}).call(this);
