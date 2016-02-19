/**
 * Artoo.js Cookie Parser Unit Tests
 * ==================================
 *
 */
import assert from 'assert';
import parseCookie from '../src/parsers/cookie';

describe('#.parsers.cookie', function() {
  it('should correctly parse cookie strings.', function() {
    const cookies = [
      'LSID=CUSTOM_ID; Path=/accounts; Expires=Wed, 13 Jan 2021 22:23:01 GMT; Secure; HttpOnly'
    ];

    const parsed = [
      {
        path: '/accounts',
        expires: 'Wed, 13 Jan 2021 22:23:01 GMT',
        secure: true,
        httpOnly: true,
        key: 'LSID',
        value: 'CUSTOM_ID'
      }
    ];

    cookies.forEach((cookie, i) => {
      assert.deepEqual(parseCookie(cookie), parsed[i]);
    });
  });
});
