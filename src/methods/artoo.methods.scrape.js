;(function(undefined) {
  'use strict';

  /**
   * artoo scrape methods
   * =====================
   *
   * Some scraping helpers.
   */
  var _root = this;

  // TODO: recursive
  artoo.scrape = function(iterator, data, params) {
    params = params || {};

    var $ = this.$,
        scraped = [];

    // Transforming to selector
    var $iterator = this.helpers.enforceSelector(iterator);

    // Iteration
    $iterator.each(function() {
      var $sel,
          item = {},
          o,
          i;

      for (i in data) {
        o = data[i];

        // Polymorphism
        if ($.isFunction(o)) {
          item[i] = o.call(this, $);
        }
        else {
          $sel = $(this).find(o.sel);
          item[i] = (o.attr !== undefined) ?
            $sel.attr(o.attr) :
            $sel[o.method || 'text']();
        }
      }

      scraped.push(item);
    });

    // Returning and done callback
    if ($.isFunction(params.done))
      params.done(scraped);

    return scraped;
  };
}).call(this);
