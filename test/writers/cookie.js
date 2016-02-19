/**
 * Artoo.js Cookie Writer Unit Tests
 * ==================================
 *
 */
import assert from 'assert';
import writeCookie from '../../src/writers/cookie';
import parseCookie from '../../src/parsers/cookie';

describe('#.writers.cookie', function() {

  it('should correctly write cookies.', function() {
    const paramsList = [
      ['key', 'value'],
      ['key', 'value', {secure: true}]
    ];

    const cookies = [
      'key=value',
      'key=value; Secure'
    ];

    paramsList.forEach((params, i) => {
      assert.strictEqual(writeCookie(...params), cookies[i]);
    });
  });

  it('should throw if given parameters are invalid.', function() {
    assert.throws(function() {
      writeCookie({key: 'key'});
    }, /invalid/);
  });

  it('should be able to take the result of the parser as input.', function() {
    const cookie = 'LSID=CUSTOM_ID; Expires=Wed, 13 Jan 2021 22:23:01 GMT; Path=/accounts; HttpOnly; Secure';

    assert.strictEqual(
      writeCookie(parseCookie(cookie)),
      cookie
    );
  });
});
