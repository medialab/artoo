;(function(undefined) {

  /**
   * artoo prod bookmarklet
   * =======================
   *
   * The bookmarklet loading the production version hosted on a full-fledged
   * HTTPS server (github for the time being).
   */
  var body = document.getElementsByTagName('body')[0],
      script = document.createElement('script'),
      r = Math.random();

    script.src = '//raw.githubusercontent.com/medialab/artoo/master/build/artoo.min.js';
    script.type = 'text/javascript';

    // Appending to body
    body.appendChild(script);
})();
