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
  var t = 0;
  function expand(params, i) {
    i = i || 1;

    var canExpand = (params.canExpand) ?
      (typeof params.canExpand === 'string' ?
        artoo.$(params.canExpand).length > 0 :
        params.canExpand()) :
      true;

    // Is this over?
    if (!canExpand || i >= params.limit) {
      if (typeof params.done === 'function')
        params.done();
      return;
    }

    // Triggering expand
    if (typeof params.expand === 'string')
      artoo.$(params.expand).simulate('click');
    else
      params.expand();

    // Waiting for the content to expand
    if (!params.isExpanding) {
      expand(params, ++i);
    }
    else {
      if (typeof params.isExpanding === 'number') {
        setTimeout(expand, params.isExpanding, params, ++i);
      }
      else {
        var isExpanding = (typeof params.isExpanding === 'string') ?
          function() {
            return artoo.$(params.isExpanding).length > 0;
          } :
          params.isExpanding;

        artoo.waitFor(
          function() {
            return !isExpanding();
          },
          function() {
            expand(params, ++i);
          },
          {timeout: params.timeout}
        );
      }
    }
  }

  // Todo: throttle?
  artoo.autoExpand = function(params, cb) {
    params = params || {};
    params.done = cb || params.done;

    if (!params.expand) {
      artoo.log.error('You did not pass an expand function to artoo\'s' +
                      ' autoExpand method.');
      return;
    }

    expand(params);
  };
}).call(this);
