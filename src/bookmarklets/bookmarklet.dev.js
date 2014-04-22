;(function(undefined) {
  'use strict';

  /**
   * artoo dev bookmarklet
   * ======================
   *
   * The bookmarklet loading artoo into a web page.
   */

  // Checking preexistence of artoo
  var exists = typeof artoo !== 'undefined',
      usurpator = exists ?
        !(artoo.passphrase && artoo.passphrase === 'detoo') : false;

  if (usurpator) {
    console.log('An usurper artoo lives within this page!');
    return;
  }

  if (!exists) {
    var body = document.getElementsByTagName('body')[0],
      script = document.createElement('script'),
      r = Math.random();

    script.src = 'http://localhost:8000/build/artoo.concat.js?r=' + r;
    script.type = 'text/javascript';

    // Appending to body
    body.appendChild(script);
    return;
  }

  console.log('artoo is already here. No need to invoke him again.');
})();
