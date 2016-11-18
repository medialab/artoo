;(function(undefined) {

  /**
   * artoo background script
   * ========================
   *
   * This chrome background script check for CSP protection in response
   * headers and circumvent them.
   */

  var _globals = {
    enabled: true
  };

  var possibleHeaders = [
    'x-webkit-csp',
    'content-security-policy'
  ];

  chrome.webRequest.onHeadersReceived.addListener(
    function(details) {

      // Not overriding when artoo is disabled
      if (!_globals.enabled)
        return;

      var i, l, o;

      for (i = 0, l = details.responseHeaders.length; i < l; i++) {
        o = details.responseHeaders[i];

        if (~possibleHeaders.indexOf(o.name.toLowerCase()))
          o.value = 
            "default-src *;" +
            "script-src * 'unsafe-inline' 'unsafe-eval';" +
            "connect-src * 'unsafe-inline' 'unsafe-eval';" +
            "style-src * 'unsafe-inline';";
      }

      return {
        responseHeaders: details.responseHeaders
      };
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

  // Browser action
  chrome.browserAction.onClicked.addListener(function() {
    
    // Changing icon and disabling
    if (_globals.enabled)
      chrome.browserAction.setIcon(
        {path: {'19': 'chrome/icons/icon19-disabled.png',
                '38': 'chrome/icons/icon38-disabled.png'}});
    else
      chrome.browserAction.setIcon(
        {path: {'19': 'chrome/icons/icon19.png',
                '38': 'chrome/icons/icon38.png'}});

    _globals.enabled = !_globals.enabled;
  });

  // Receiving variable requests
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.variable === 'enabled')
      sendResponse({enabled: _globals.enabled});
  });

  // Exporting to window
  this.globals = _globals;
}).call(this);
