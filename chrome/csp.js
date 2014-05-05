;(function(undefined) {

  /**
   * artoo Content Security Policy override
   * =======================================
   *
   * This chrome background script check for CSP protection in response
   * header and circumvent them.
   */

  var possibleHeaders = [
    'x-webkit-csp',
    'content-security-policy'
  ];

  chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
      var i, l, o;

      for (i = 0, l = details.responseHeaders.length; i < l; i++) {
        o = details.responseHeaders[i];

        if (~possibleHeaders.indexOf(o.name.toLowerCase())
          o.value = 'default-src *; script-src *;';
      }
    },
    {
      urls: ['http://*/*', 'https://*/*'],
      types: [
      'main_frame',
      'sub_frame',
      'stylesheet',
      'script',
      'image',
      'object',
      'xmlhttprequest',
      'other'
      ]
    },
    ['blocking', 'responseHeaders']
  );
}).call(this);
