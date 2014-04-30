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
    if ($.isFunction(o)) {
      return o.call(scope, $);
    }
    else {
      $sel = $(scope).find(o.sel);
      return (o.attr !== undefined) ?
        $sel.attr(o.attr) :
        $sel[o.method || 'text']();
    }
  }

  // TODO: recursive
  artoo.scrape = function(iterator, data, params) {
    var $ = this.$,
        scraped = [],
        loneSelector = !!data.sel ||
                       typeof data === 'string' ||
                       typeof data === 'function';

    params = params || {};
    data = typeof data === 'string' ? {sel: data, method: 'text'} : data;

    // Transforming to selector
    var $iterator = this.helpers.enforceSelector(iterator);

    // Iteration
    $iterator.each(function() {
      var item = {},
          i;

      if (loneSelector)
        item = step(data, this);
      else
        for (i in data)
          item[i] = step(data[i], this);

      scraped.push(item);
    });

    // Returning and done callback
    if (typeof params.done === 'function')
      params.done(scraped);

    return scraped;
  };
}).call(this);
