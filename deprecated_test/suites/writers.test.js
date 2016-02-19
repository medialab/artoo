;(function(undefined) {

  /**
   * artoo writers unit tests
   * =========================
   *
   */
  describe('artoo.writers', function() {

    describe('csv', function() {
      var arrays = {
        correct: [['Michel', 'Chenu'], ['Marion', 'La brousse']],
        delimiter: [['Michel', 'Chenu, the Lord'], ['Marion', 'La brousse']],
        escape: [['Michel', 'Chenu'], ['Marion', 'dit "La brousse"']],
        badass: [['Michel', 'Chenu, the Lord'], ['Marion', 'dit "La brousse"']],
        linebreak: [
          { a: 'toto', b: 'tata\n', c: 'titi' },
          { a: 'tutu', b: 'pouet',  c: 'blah' }
        ]
      };

      var strings = {
        correct: 'Michel,Chenu\nMarion,La brousse',
        delimiter: 'Michel,"Chenu, the Lord"\nMarion,La brousse',
        escape: 'Michel,Chenu\nMarion,"dit ""La brousse"""',
        badass: 'Michel,"Chenu, the Lord"\nMarion,"dit ""La brousse"""',
        tsv: 'Michel\tChenu\nMarion\tLa brousse',
        customEscape: 'Michel,|Chenu, the Lord|\nMarion,La brousse',
        linebreak: 'a,b,c\ntoto,"tata\n",titi\ntutu,pouet,blah'
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

      it('should be able to handle simple cases.', function() {
        for (var i in arrays) {
          assert.strictEqual(
            artoo.writers.csv(arrays[i]),
            strings[i]
          );
        }
      });

      it('should be able to handle custom delimiters.', function() {
        assert.strictEqual(
          artoo.writers.csv(arrays.correct, {delimiter: '\t'}),
          strings.tsv
        );
      });

      it('should be able to handle custom escape characters.', function() {
        assert.strictEqual(
          artoo.writers.csv(arrays.delimiter, {escape: '|'}),
          strings.customEscape
        );
      });

      it('should be able to output a string with correct headers.', function() {

        // Basic
        assert.strictEqual(
          artoo.writers.csv(headerArray),
          headerString
        );

        // We don't want headers
        assert.strictEqual(
          artoo.writers.csv(headerArray, {headers: false}),
          strings.correct
        );

        // Custom headers applied on array
        assert.strictEqual(
          artoo.writers.csv(arrays.correct, {headers: ['one', 'two']}),
          customString
        );

        // Custom headers applied on array of objects
        assert.strictEqual(
          artoo.writers.csv(headerArray, {headers: ['one', 'two']}),
          customString
        );
      });

      it('should be able to output a CSV from other things than strings.', function() {
        assert.strictEqual(
          artoo.writers.csv([[1, 2], [3, 4]]),
          '1,2\n3,4'
        );
      });

      it('should be able to output a full CSV from array of items with different keys.', function() {
        assert.strictEqual(
          artoo.writers.csv([
            {
              key1: 'ok',
              key2: 'ok'
            },
            {
              key1: 'ko',
              key3: 'ko'
            }
          ]),
          'key1,key2,key3\nok,ok,\nko,,ko'
        );
      });

      it('should be able to output a CSV with a specified order.', function() {
        assert.strictEqual(
          artoo.writers.csv([
            {
              key1: 'ok',
              key2: 'ok'
            },
            {
              key1: 'ko',
              key3: 'ko'
            }
          ], {order: ['key2', 'key1']}),
          'key2,key1\nok,ok\n,ko'
        );
      });

      it('should be possible to combine an order and headers to output a CSV.', function() {
        assert.strictEqual(
          artoo.writers.csv([
            {
              key1: 'ok',
              key2: 'ok'
            },
            {
              key1: 'ko',
              key3: 'ko'
            }
          ], {order: ['key1', 'key2'], headers: ['Keyone', 'Keytwo']}),
          'Keyone,Keytwo\nok,ok\nko,'
        );
      });
    });
  });
}).call(this);
