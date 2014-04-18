;(function(undefined) {
  'use strict';

  /**
   * artoo core
   * ===========
   *
   */
  var _root = this;

  var artoo = {
    $: null,
    version: '0.0.1',
    passphrase: 'detoo',
    jquery: {
      version: '2.1.0',
      export: function() {
        _root.ß = artoo.$;
      }
    }
  };

  if (typeof this.exports !== 'undefined') {
    if (typeof this.module !== 'undefined' && this.module.exports)
      this.exports = this.module.exports = artoo;
    this.exports.artoo = artoo;
  }
  this.artoo = artoo;
}).call(this);

;(function(undefined) {
  'use strict';

  /**
   * artoo helpers
   * ==============
   *
   */
  var root = this;


  // Extend objects
  function extend() {
    var i,
        k,
        res = {},
        l = arguments.length;

    for (i = l - 1; i >= 0; i--)
      for (k in arguments[i])
        res[k] = arguments[i][k];

    return res;
  }

  // Package helper
  function pkg(pkgName) {
    return (pkgName || '').split('.').reduce(function(context, objName) {
      return (objName in context) ?
        context[objName] :
        (context[objName] = {});
    }, _root);
  }

  // Loading an external script
  function getScript(url, cb) {
    var script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0],
        done = false;

    // Defining the script tag
    script.src = url;
    script.onload = script.onreadystatechange = function() {
      if (!done &&
          (!this.readyState ||
            this.readyState == 'loaded' ||
            this.readyState == 'complete')) {
        done = true;
        cb();
        script.onload = script.onreadystatechange = null;
        head.removeChild(script);
      }
    };

    // Appending the script to head
    head.appendChild(script);
  }

  // Exporting
  artoo.helpers = {
    extend: extend,
    getScript: getScript,
    pkg: pkg
  };
}).call(this);

;(function(undefined) {
  'use strict';

  /**
   * artoo console abstraction
   * ==========================
   *
   * Console abstraction enabling artoo to perform a finer logging job.
   */

  // Return the logo ASCII array
  function robot() {
    return [
      '   .-""-.   ',
      '  /[] _ _\\  ',
      ' _|_o_LII|_ ',
      '/ | ==== | \\',
      '|_| ==== |_|',
      ' ||LI  o ||',
      ' ||\'----\'||',
      '/__|    |__\\'
    ];
  }

  // Log override
  artoo.log = function() {
    console.log.apply(console, arguments);
  };

  // Logo display
  artoo.welcome = function() {
    var ascii = robot();

    ascii[ascii.length - 2] = ascii[ascii.length - 2] + '    artoo';

    console.log(ascii.join('\n') + '   v' + artoo.version);
  };
}).call(this);

;(function(undefined) {
  'use strict';

  /**
   * jQuery Injection
   * =================
   *
   * Checking whether a version of jquery lives in the targeted page
   * and gracefully inject it without generating conflicts.
   */

  function inject(cb) {

    // Properties
    var desiredVersion = artoo.jquery.version,
        cdn = '//code.jquery.com/jquery-' + desiredVersion + '.min.js';

    // Checking the existence of jQuery or of another library.
    var exists = typeof jQuery !== 'undefined',
        other = !exists && typeof $ === 'function',
        currentVersion = exists ? jQuery.fn.jquery : '0',
        chromeAPI = typeof $$ !== 'undefined' &&
          !!~$$.toString().indexOf('[Command Line API]');

    // jQuery is already in a correct mood
    if (exists && currentVersion.charAt(0) === '2') {
      artoo.log('jQuery already exists in this page ' +
                '(v' + currentVersion + '). No need to load it again.');

      // Internal reference
      artoo.$ = jQuery;

      cb();
    }

    // jQuery has not the correct version or another library uses $
    else if ((exists && currentVersion.charAt(0) !== '2') || other) {
      artoo.helpers.getScript(cdn, function() {
        artoo.log('Either jQuery has not a valid version or another library ' +
                  'using dollar is already present.\n' +
                  'Exporting correct version to ß (or artoo.$).');

        artoo.$ = jQuery.noConflict();
        artoo.jquery.export();

        cb();
      });
    }

    // jQuery does not exist at all, we load it
    else {
      artoo.helpers.getScript(cdn, function() {
        artoo.log('artoo loaded jQuery into your page ' +
                  '(v' + desiredVersion + ').');

        artoo.$ = jQuery;

        cb();
      });
    }
  }

  // Exporting
  artoo.inject = inject;
}).call(this);

;(function(undefined) {
  'use strict';

  /**
   * artoo initialization
   * =====================
   *
   * Batch of operations to be run when launching artoo into a web page.
   */
  function init() {

    // Welcoming user
    artoo.welcome();

    // Injecting jQuery
    artoo.inject(function() {
      artoo.log('artoo is now good to go!');
    });
  }

  init();
}).call(this);
