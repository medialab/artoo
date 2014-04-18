;(function(undefined) {
  'use strict';

  /**
   * artoo core
   * ===========
   *
   * The main artoo namespace and its vital properties.
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
    },
    methods: {}
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
   * Some useful helpers.
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
        script.onload = script.onreadystatechange = null;
        head.removeChild(script);

        if (typeof cb === 'function')
          cb();
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
   * artoo save methods
   * ===================
   *
   * Some helpers to save data to a file that will be downloaded by the
   * browser. Works mainly with chrome for the time being.
   *
   * Mainly inspired by:
   * https://github.com/eligrey/FileSaver.js/blob/master/FileSaver.js
   */
  var _root = this;

  // Properties
  var defaultFilename = 'data',
      defaultEncoding = 'utf-8',
      defaultMime = 'application/octet-stream',
      xmlns = 'http://www.w3.org/1999/xhtml',
      deletionQueue = [],
      mimeShortcuts = {
        csv: 'text/csv',
        json: 'application/json'
      };

  var reqfs = window.requestFileSystem ||
              window.webkitRequestFileSystem ||
              window.mozRequestFileSystem;

  var URL = _root.URL || _root.webkitURL || _root;

  // Saver Abstraction
  function Saver(blob, filename) {
    var _this = this,
        minSize = blob.size,
        saveLink = document.createElementNS(xmlns, 'a'),
        canUseSaveLink = !_root.externalHost && 'download' in saveLink;

    // State
    this.WRITING = 1;
    this.DONE = 2;

    // First method
    console.log(canUseSaveLink);
    if (canUseSaveLink) {
      var oURL = blobURL(blob);

      // Updating the save link
      saveLink.href = oURL;
      saveLink.download = filename;

      // Creating event
      var e = document.createEvent('MouseEvents');
      e.initMouseEvent(
        'click', true, false, _root, 0, 0, 0, 0, 0,
        false, false, false, false, 0, null);

      saveLink.dispatchEvent(e);
      this.readyState = this.DONE;
      // dispatch_all
    }
  }

  // Blob creation
  function createBlob(data, mime, encoding) {
    mime = mimeShortcuts[mime] || mime || defaultMime;
    return new Blob(
      [data],
      {type: mime + ';charset=' + encoding || defaultEncoding}
    );
  }

  // Url from blob
  function blobURL(blob) {
    var oURL = URL.createObjectURL(blob);
    deletionQueue.push(oURL);
    return oURL;
  }

  // Main interface
  function save(data, params) {

  }

  // Exporting
  artoo.save = function(data, filename, type) {

  };

  artoo.saveJson = function(data, filename) {
    // stringify
  };

  artoo.saveCsv = function(data, filename) {
    // stringify if array of array and !== string
  };

  artoo.test = function(data) {
    new Saver(createBlob(JSON.stringify(data), 'json'), 'test.json');
  };
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
