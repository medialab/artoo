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

    var o = (typeof list === 'function') ? list(i) : list[i];

    // Breaking if iterator returns false
    if (o === false)
      return params.done(acc);

    var get = (typeof o === 'string') ?
      function(c) {
        artoo.$.get(o, c);
      } :
      function(c) {
        artoo.$[o.method || params.method || 'get'](
          o.url, o.data || params.data || {}, c
        );
      };

    // Getting data with ajax
    if (params.throttle > 0)
      setTimeout(get, !i ? 0 : params.throttle, dataRetrieved);
    else if (typeof params.throttle === 'function')
      setTimeout(get, !i ? 0 : params.throttle(i), dataRetrieved);
    else
      get(dataRetrieved);

    function dataRetrieved(data) {
      var result = (typeof params.callback === 'function') ?
        params.callback(data, i, acc) :
        data;

      // If false is returned as the callback, we break
      if (result === false)
        return params.done(acc);

      // Concat or push?
      if (params.concat)
        acc = acc.concat(result);
      else
        acc.push(result);

      // Incrementing
      i++;

      if (artoo.helpers.isArray(list) && i === list.length)
        params.done(acc);
      else
        loop(list, params, acc, i);
    }
  }

  // TODO: asynchronous
  artoo.ajaxSpider = function(list, params, cb) {
    var fn,
        p;

    // Default
    params = params || {};

    // If only callback
    if (typeof params === 'function') {
      fn = params;
      params = {};
      params.done = fn;
    }

    // Dealing with callback polymorphism
    if (typeof cb === 'function')
      p = artoo.helpers.extend({done: cb}, params);

    loop(list, artoo.helpers.extend(p || params, {done: artoo.helpers.noop}));
  };
}).call(this);
