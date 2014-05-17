;(function(undefined) {
  'use strict';

  /**
   * artoo ajaxSpider method
   * ========================
   *
   * A useful method to scrape data from a list of ajax urls.
   */
  var _root = this;

  function loop(list, params, acc, i) {
    acc = acc || [];
    i = i || 0;

    var o = list[i];

    var get = (typeof o === 'string') ?
      function(c) {
        artoo.$.get(o, c);
      } :
      function(c) {
        artoo.$[o.method || params.method || 'get'](o.url, o.data || {}, c);
      };

    // Getting data with ajax
    if (params.throttle)
      setTimeout(get, !i || params.throttle, dataRetrieved);
    else
      get(dataRetrieved);

    function dataRetrieved(data) {
      acc.push(params.callback ? params.callback(data, i, acc) : data);

      if (++i === list.length && typeof params.done === 'function')
        params.done(acc);
      else
        loop(list, params, acc, i);
    }
  }

  // TODO: Possibility for an iterator as list
  // TODO: if fn returns false or list run dry, we stop
  // TODO: asynchronous
  artoo.ajaxSpider = function(list, params, cb) {
    params = params || {};
    cb = cb || params.done;

    loop(list, params);
  };
}).call(this);
