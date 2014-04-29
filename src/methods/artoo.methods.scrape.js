;(function(undefined) {
  'use strict';

  /**
   * artoo scrape methods
   * =====================
   *
   * Some scraping helpers.
   */
  var _root = this,
      $ = artoo.jquery.get();

  // TODO: recursive
  artoo.scrape = function(iterator, data, params) {
    var scraped = $.isArray(data) ? [] : {};

    // Transforming to selector
    var $iterator = this.helpers.enforceSelector(iterator);

    // Iteration
    $iterator.each(function() {
      var $sel,
          o,
          i;

      for (i in data) {
        o = data[i];
        $sel = $(this).find(o.sel);
        scraped[i] = (o.attr !== undefined) ?
          $sel.attr(o.attr) :
          $sel[method]();
      }
    });

    // Returning and done callback
    if ($.isFunction(params.done))
      params.done(scraped);

    return scraped;
  };
}).call(this);
