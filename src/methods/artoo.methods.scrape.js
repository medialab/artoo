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
      if (o === 'text' || o === 'html')
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
  artoo.scrape = function(iterator, data, params) {
    var scraped = [],
        loneSelector = !!data.attr || !!data.method ||
                       typeof data === 'string' ||
                       typeof data === 'function';

    params = params || {};

    // Transforming to selector
    var $iterator = this.helpers.enforceSelector(iterator);

    // Iteration
    $iterator.each(function() {
      var item = {},
          i;

      if (loneSelector)
        item = step(data, this);
      else
        for (i in data) {
          item[i] = step(data[i], this);
        }

      scraped.push(item);
    });

    // Returning and done callback
    if (typeof params.done === 'function')
      params.done(scraped);

    return scraped;
  };

  // Alternative
  artoo.scrap = artoo.scrape;
}).call(this);
