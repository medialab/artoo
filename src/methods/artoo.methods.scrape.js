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
        $sel;

    // Polymorphism
    if (typeof o === 'function') {
      return o.call(scope, $);
    }
    else {
      $sel = o.sel ? $(scope).find(o.sel) : $(scope);
      return (o.attr !== undefined) ?
        $sel.attr(o.attr) :
        $sel[o.method || 'text']();
    }
  }

  // TODO: recursive
  artoo.scrape = function(iterator, data, params) {
    var scraped = [],
        loneSelector = !!data.sel ||
                       typeof data === 'string' ||
                       typeof data === 'function',
        model;

    params = params || {};
    model = typeof data === 'string' ? {sel: data, method: 'text'} : data;

    // Transforming to selector
    var $iterator = this.helpers.enforceSelector(iterator);

    // Iteration
    $iterator.each(function() {
      var item = {},
          i;

      if (loneSelector)
        item = step(model, this);
      else
        for (i in model) {
          item[i] = step(model[i], this);
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
