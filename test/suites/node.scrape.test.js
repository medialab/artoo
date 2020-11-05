/**
 * artoo scrape method node unit tests
 * ===================================
 *
 */
var cheerio = require('cheerio'),
    artoo = require('../../build/artoo.node.js');

function readFile(path) {
    return fs.readFileSync(path, 'utf-8');
}

// Monkey patch - begin
var assert = require('assert')
var fs = require('fs')
var $

helpers = {
    // Define a nodejs compliant fetchHTMLResource
    fetchHTMLResource: function (name, cb) {
        var $newDom = cheerio.load('<div id="' + name + '"></div>');
        artoo.setContext($newDom)
        $newDom('#' + name).append(readFile(__dirname + '/../resources/' + name + '.html'));
        artoo.setContext($newDom)
        $ = $newDom
        cb('#' + name);
    }
};
// Monkey patch - end

eval(readFile(__dirname + '/scrape.test.js'))
