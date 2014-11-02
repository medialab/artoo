;(function(undefined) {
  'use strict';

  /**
   * artoo parsers
   * ==============
   *
   * Compilation of small parsers aim at understanding some popular web
   * string formats such as querystrings, headers etc.
   */

  function parseQueryString(s) {
    var data = {};

    s.split('&').forEach(function(item) {
      var pair = item.split('=');
      data[decodeURIComponent(pair[0])] =
        pair[1] ? decodeURIComponent(pair[1]) : true;
    });

    return data;
  }

  function parseUrl(url) {
    var data = {url: url};

    // Searching for a protocol
    var ps = url.split('://');

    if (ps.length > 1)
      data.protocol = ps[0];

    url = ps[ps.length > 1 ? 1 : 0];

    // Searching for origin
    var m = url.match(/([^\/:]+)(.*)/);
    data.origin = m[1];

    if (m[2]) {
      var f = m[2].trim();

      // Port
      if (f.charAt(0) === ':')
        data.port = +f.match(/\d+/)[0];

      // Path
      data.fullPath = '/' + f.split('/').slice(1).join('/');

      data.path = data.fullPath.split('?')[0].split('#')[0];
    }

    // Tld
    if (~data.origin.search('.')) {
      var ds = data.origin.split('.');

      // Check for IP
      if (!(ds.length === 4 &&
          ds.every(function(i) { return !isNaN(+i); }))) {

        // Checking TLD-less urls
        if (ds.length > 1) {

          // TLD
          data.tld = ds[ds.length - 1];

          // Domain
          data.domain = ds[ds.length - 2];

          // Subdomains
          if (ds.length > 2) {
            data.subdomains = [];
            for (var i = 0, l = ds.length - 2; i < l; i++)
              data.subdomains.unshift(ds[i]);
          }
        }
        else {

          // TLD-less url
          data.domain = ds[0];
        }
      }
      else {

        // This is an IP
        data.domain = data.origin;
      }
    }

    // Hash
    var hs = url.split('#');

    if (hs.length > 1) {
      data.hash = hs[1];
    }

    // Querystring
    var qs = url.split('?');

    if (qs.length > 1) {
      data.querystring = qs[1];
      data.params = parseQueryString(qs[1]);
    }

    return data;
  }

  function parseHeaders(headers) {
    var data = {};

    headers.split('\n').filter(function(item) {
      return i.trim();
    }).forEach(function(item) {
      if (item) {
        var pair = item.split(': ');
        data[pair[0]] = pair[1];
      }
    });

    return data;
  }

  /**
   * Exporting
   */
  artoo.parsers = {
    headers: parseHeaders,
    queryString: parseQueryString,
    url: parseUrl
  };
}).call(this);
