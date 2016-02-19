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
    var data = {href: url};

    // Searching for a protocol
    var ps = url.split('://');

    if (ps.length > 1)
      data.protocol = ps[0];

    url = ps[ps.length > 1 ? 1 : 0];

    // Searching for an authentification
    var a = url.split('@');
    if (a.length > 1) {
      var as = a[0].split(':');
      if (as.length > 1) {
        data.auth = {
          user: as[0],
          password: as[1]
        };
      }
      else {
        data.auth = {
          user: as[0]
        };
      }

      url = a[1];
    }

    // Searching for origin
    var m = url.match(/([^\/:]+)(.*)/);
    data.host = m[1];
    data.hostname = m[1];

    if (m[2]) {
      var f = m[2].trim();

      // Port
      if (f.charAt(0) === ':') {
        data.port = +f.match(/\d+/)[0];
        data.host += ':' + data.port;
      }

      // Path
      data.path = '/' + f.split('/').slice(1).join('/');

      data.pathname = data.path.split('?')[0].split('#')[0];
    }

    // Tld
    if (~data.hostname.search('.')) {
      var ds = data.hostname.split('.');

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
        data.domain = data.hostname;
      }
    }

    // Hash
    var hs = url.split('#');

    if (hs.length > 1) {
      data.hash = '#' + hs[1];
    }

    // Querystring
    var qs = url.split('?');

    if (qs.length > 1) {
      data.search = '?' + qs[1];
      data.query = parseQueryString(qs[1]);
    }

    // Extension
    var ss = data.pathname.split('/'),
        es = ss[ss.length - 1].split('.');

    if (es.length > 1)
      data.extension = es[es.length - 1];

    return data;
  }

  function parseHeaders(headers) {
    var data = {};

    headers.split('\n').filter(function(item) {
      return item.trim();
    }).forEach(function(item) {
      if (item) {
        var pair = item.split(': ');
        data[pair[0]] = pair[1];
      }
    });

    return data;
  }

  function parseCookie(s) {
    var cookie = {
      httpOnly: false,
      secure: false
    };

    if (!s.trim())
      return;

    s.split('; ').forEach(function(item) {

      // Path
      if (~item.search(/path=/i)) {
        cookie.path = item.split('=')[1];
      }
      else if (~item.search(/expires=/i)) {
        cookie.expires = item.split('=')[1];
      }
      else if (~item.search(/httponly/i) && !~item.search('=')) {
        cookie.httpOnly = true;
      }
      else if (~item.search(/secure/i) && !~item.search('=')) {
        cookie.secure = true;
      }
      else {
        var is = item.split('=');
        cookie.key = is[0];
        cookie.value = decodeURIComponent(is[1]);
      }
    });

    return cookie;
  }

  function parseCookies(s) {
    var cookies = {};

    if (!s.trim())
      return cookies;

    s.split('; ').forEach(function(item) {
      var pair = item.split('=');
      cookies[pair[0]] = decodeURIComponent(pair[1]);
    });

    return cookies;
  }

  /**
   * Exporting
   */
  artoo.parsers = {
    cookie: parseCookie,
    cookies: parseCookies,
    headers: parseHeaders,
    queryString: parseQueryString,
    url: parseUrl
  };
}).call(this);
