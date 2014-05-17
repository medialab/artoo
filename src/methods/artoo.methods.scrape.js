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
        $sel = o.sel ? $(scope).find(o.sel) : $(scope);

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

  // TODO: recursive
  artoo.scrape = function(iterator, data, params, cb) {
    var scraped = [],
        loneSelector = !!data.attr || !!data.method ||
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
        item = step(data, this);
      else
        for (p in data) {
          item[p] = step(data[p], this);
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
}).call(this);
