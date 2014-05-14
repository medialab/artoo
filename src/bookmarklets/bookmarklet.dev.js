;(function(undefined) {

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

  script.src = '//localhost:8000/build/artoo.concat.js?r=' + r;
  script.type = 'text/javascript';
  script.id = 'artoo_injected_script';

  script.setAttribute('settings', JSON.stringify({
    debug: true
  }));

  // Appending to body
  body.appendChild(script);
})();
