/**
 * artoo node unit tests
 * ======================
 *
 * Testing artoo node.js integration.
 */
var assert = require('assert'),
    artoo = require('../../build/artoo.node.js');

describe('artoo.node', function() {

  it('should be possible to retrieve paths.', function() {
    assert.deepEqual(Object.keys(artoo.paths), ['browser', 'chrome', 'phantom']);
  });
});
