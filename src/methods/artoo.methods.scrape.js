;(function(undefined) {
  'use strict';

  /**
   * artoo scrape methods
   * =====================
   *
   * Some scraping helpers.
   */
  var _root = this;

  // Helpers
  function step(o, scope) {
    var $ = artoo.$,
        $sel = o.sel ? $(scope).find(o.sel) : $(scope),
        s;

    // Polymorphism
    if (typeof o === 'function') {
      return o.call(scope, $);
    }
    else if (typeof o === 'string') {
      if (typeof $sel[o] === 'function')
        return $sel[o]();
      else
        return $sel.attr(o);
    }
    else {
      return (o.attr !== undefined) ?
        $sel.attr(o.attr) :
        $sel[o.method || 'text']();
    }
  }

  artoo.scrape = function(iterator, data, params, cb) {
    if (arguments.length < 2) {
      artoo.log.error('Wrong arguments passed to scrape method. artoo has ' +
                      'no clue about what he should scrape.');
      return;
    }

    var scraped = [],
        loneSelector = !!data.attr || !!data.method || data.scrape ||
                       typeof data === 'string' ||
                       typeof data === 'function';

    params = params || {};

    // Transforming to selector
    var $iterator = this.helpers.enforceSelector(iterator);

    // Iteration
    $iterator.each(function(i) {
      var item = {},
          p;

      if (loneSelector)
        item = (typeof data === 'object' && 'scrape' in data) ?
          artoo.scrape(
            $(this).find(data.scrape.sel),
            data.scrape.data,
            data.scrape.params
          ) :
          step(data, this);
      else
        for (p in data) {
          item[p] = (typeof data[p] === 'object' && 'scrape' in data[p]) ?
            artoo.scrape(
              $(this).find(data[p].scrape.sel),
              data[p].scrape.data,
              data[p].scrape.params
            ) :
            step(data[p], this);
        }

      scraped.push(item);

      // Breaking if limit i attained
      return !params.limit || i < params.limit - 1;
    });

    scraped = params.one ? scraped[0] : scraped;

    // Triggering callback
    if (typeof params === 'function')
      params(scraped);
    else if (typeof params.done === 'function')
      params.done(scraped);
    else if (typeof cb === 'function')
      cb(scraped);

    // Returning data
    return scraped;
  };

  // Scrape only the first corresponding item
  artoo.scrapeOne = function(iterator, data, params, cb) {
    return artoo.scrape(
      iterator,
      data,
      artoo.helpers.extend({limit: 1, one: true}, params),
      cb
    );
  };

  // Scrape a table
  // TODO: better header handle
  artoo.scrapeTable = function(sel, params, cb) {
    params = params || {};

    var headers;

    if (!params.headers) {
      return artoo.scrape(sel + ' tr:has(td)', {
        scrape: {
          sel: 'td',
          data: params.data || 'text'
        }
      }, params, cb);
    }
    else {
      var headerType = params.headers.type ||
                       params.headers.method && 'first' ||
                       params.headers,
          headerFn = params.headers.method;

      if (headerType === 'th') {
        headers = artoo.scrape(
          sel + ' th', headerFn || 'text'
        );
      }
      else if (headerType === 'first') {
        headers = artoo.scrape(
          sel + ' tr:has(td):first td',
          headerFn || 'text'
        );
      }
      else if (artoo.helpers.isArray(headerType)) {
        headers = headerType;
      }
      else {
        artoo.log.error('invalid header type for scrapeTable method ' +
                        '("th" or "first").');
        return;
      }

      // Scraping
      return artoo.scrape(
        sel + ' tr:has(td)' +
        (headerType === 'first' ? ':not(:first)' : ''), function() {
          var o = {};

          headers.forEach(function(h, i) {
            o[h] = step(
              params.data || 'text',
              $(this).find('td:eq(' + i + ')')
            );
          }, this);

          return o;
        }, params, cb);
    }
  };
}).call(this);
