/**
 * artoo node unit tests
 * ======================
 *
 * Testing artoo node.js integration.
 */
var assert = require('assert'),
    cheerio = require('cheerio'),
    artoo = require('../../build/artoo.node.js');

describe('artoo.node', function() {

  it('should override correctly isSelector.', function() {
    var $ = cheerio.load('<div>Hello</div>');

    assert(artoo.helpers.isSelector($));
    assert(artoo.helpers.isSelector($('div')));
  });

  it('should be possible to retrieve paths.', function() {
    assert.deepEqual(Object.keys(artoo.paths), ['browser', 'chrome', 'phantom']);
  });

  it('should be possible to bootstrap a cheerio instance.', function() {
    var $ = cheerio.load('<ul><li>item1</li><li>item2</li></ul>');

    artoo.bootstrap(cheerio);

    assert.deepEqual($('li').scrape(), ['item1', 'item2']);
  });

  it('should be possible to set artoo\'s internal context.', function() {
    var $ = cheerio.load('<ul><li>item1</li><li>item2</li></ul>');

    artoo.setContext($);

    assert.deepEqual(artoo.scrape('li'), ['item1', 'item2']);
  });
});
