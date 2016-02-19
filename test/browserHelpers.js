/**
 * Artoo.js Browser Helpers Unit Tests
 * ====================================
 *
 */
import assert from 'assert';
import {isDocument} from '../src/browserHelpers';
import {
  injectBrowserEnvironment,
  restoreOriginalEnvironment
} from './injection';

describe('Browser helpers', function() {

  before(injectBrowserEnvironment);
  after(restoreOriginalEnvironment);

  describe('#.isDocument', function() {
    it('should detect documents correctly.', function() {

      assert(isDocument(new HTMLDocument()));
      assert(!isDocument(null));
      assert(!isDocument({hello: 'world'}));
    });
  });
});
