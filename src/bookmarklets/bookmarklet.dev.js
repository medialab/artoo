;(function(undefined) {
  'use strict';

  /**
   * artoo dev bookmarklet
   * ======================
   *
   * The bookmarklet loading the development version of artoo served by
   * localhost:8000.
   */
  var body = document.getElementsByTagName('body')[0],
      script = document.createElement('script'),
      r = Math.random();

    script.src = 'http://localhost:8000/build/artoo.concat.js?r=' + r;
    script.type = 'text/javascript';

    // Appending to body
    body.appendChild(script);
})();
