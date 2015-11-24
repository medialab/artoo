;(function(undefined) {

  /**
   * artoo chrome injection
   * =======================
   *
   * This chrome content script injects artoo in every relevant page when the
   * artoo's extension is activated.
   */

  function injectScript() {

    // Creating script element
    var script = document.createElement('script'),
        body = document.getElementsByTagName('body')[0];

    script.src = chrome.extension.getURL('build/artoo.chrome.js');
    script.type = 'text/javascript';
    script.id = 'artoo_injected_script';
    script.setAttribute('chrome', 'true');

    // Appending to body
    body.appendChild(script);
  }

  // Requesting variables from background page
  chrome.runtime.sendMessage({variable: 'enabled'}, function(response) {

    // If artoo is enabled, we inject the script
    if (response.enabled)
      injectScript();
  });

  // Listening to page's messages
  window.addEventListener('message', function(e) {
    // console.log('received', e);
  }, false);
}).call(this);
