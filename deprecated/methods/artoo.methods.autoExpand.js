;(function(undefined) {
  'use strict';

  /**
   * artoo autoExpand methods
   * =========================
   *
   * Some useful functions to expand programmatically some content in
   * the scraped web page.
   */
  var _root = this;

  function _expand(params, i, c) {
    i = i || 0;

    var canExpand = (params.canExpand) ?
      (typeof params.canExpand === 'string' ?
        artoo.$(params.canExpand).length > 0 :
        params.canExpand(artoo.$)) :
      true;

    // Is this over?
    if (!canExpand || i >= params.limit) {
      if (typeof params.done === 'function')
        params.done();
      return;
    }

    // Triggering expand
    var expandFn = (typeof params.expand === 'string') ?
      function() {
        artoo.$(params.expand).simulate('click');
      } :
      params.expand;

    if (params.throttle)
      setTimeout(
        expandFn,
        typeof params.throttle === 'function' ?
          params.throttle(i) :
          params.throttle,
        artoo.$
      );
    else
      expandFn(artoo.$);

    // Waiting expansion
    if (params.isExpanding) {

      // Checking whether the content is expanding and waiting for it to end.
      if (typeof params.isExpanding === 'number') {
        setTimeout(_expand, params.isExpanding, params, ++i);
      }
      else {
        var isExpanding = (typeof params.isExpanding === 'string') ?
          function() {
            return artoo.$(params.isExpanding).length > 0;
          } :
          params.isExpanding;

        artoo.waitFor(
          function() {
            return !isExpanding(artoo.$);
          },
          function() {
            _expand(params, ++i);
          },
          {timeout: params.timeout}
        );
      }
    }
    else if (params.elements) {
      c = c || artoo.$(params.elements).length;

      // Counting elements to check if those have changed
      artoo.waitFor(
        function() {
          return artoo.$(params.elements).length > c;
        },
        function() {
          _expand(params, ++i, artoo.$(params.elements).length);
        },
        {timeout: params.timeout}
      );
    }
    else {

      // No way to assert content changes, continuing...
      _expand(params, ++i);
    }
  }

  // TODO: throttle (make wrapper with setTimeout)
  artoo.autoExpand = function(params, cb) {
    params = params || {};
    params.done = cb || params.done;

    if (!params.expand)
      throw Error('artoo.autoExpand: you must provide an expand parameter.');

    _expand(params);
  };
}).call(this);
