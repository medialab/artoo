;(function(undefined) {
  'use strict';

  /**
   * artoo ajaxSpider method
   * ========================
   *
   * A useful method to scrape data from a list of ajax urls.
   */
  var _root = this;

  function loop(list, params, i, acc, lastData) {
    acc = acc || [];
    i = i || 0;

    var o = (typeof list === 'function') ? list(i, lastData) : list[i];

    // Breaking if iterator returns a falsy value
    if (!o)
      return params.done(acc);

    function get(c) {
      if (o.settings || params.settings)
        artoo.$.ajax(
          o.url || params.url || o,
          artoo.helpers.extend(
            o.settings || params.settings,
            {
              success: c,
              data: o.data || params.data || {},
              type: o.method || params.method || 'get'
            }
          )
        );
      else
        artoo.$[o.method || params.method || 'get'](
          o.url || params.url || o,
          o.data || params.data || {},
          c
        );
    }

    // Getting data with ajax
    if (params.throttle > 0)
      setTimeout(get, !i ? 0 : params.throttle, dataRetrieved);
    else if (typeof params.throttle === 'function')
      setTimeout(get, !i ? 0 : params.throttle(i), dataRetrieved);
    else
      get(dataRetrieved);

    function dataRetrieved(data) {

      // Applying callback on data
      var result = data;

      if (params.scrape || params.scrapeOne || params.jquerify)
        data = artoo.helpers.jquerify(data);

      if (params.scrape || params.scrapeOne) {
        var chosenScraper = params.scrape ? 'scrape' : 'scrapeOne';
        result = artoo[chosenScraper](
          data.find(params[chosenScraper].iterator),
          params[chosenScraper].data,
          params[chosenScraper].params
        );
      }
      else if (typeof params.process === 'function') {
        result = params.process(data, i, acc);
      }

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

      if ((artoo.helpers.isArray(list) && i === list.length) ||
          i === params.limit)
        params.done(acc);
      else
        loop(list, params, i, acc, data);
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
