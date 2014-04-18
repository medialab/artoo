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

  // Polyfills
  var reqfs = window.requestFileSystem ||
              window.webkitRequestFileSystem ||
              window.mozRequestFileSystem;

  var URL = _root.URL || _root.webkitURL || _root;

  // Main abstraction
  function Saver() {
    var _saver;

    // Properties
    this.defaultFilename = 'artoo_data';
    this.defaultEncoding = 'utf-8';
    this.forceDownloadMimeType = 'application/octet-stream';
    this.defaultMimeType = 'text/plain';
    this.xmlns = 'http://www.w3.org/1999/xhtml';
    this.deletionQueue = [];
    this.mimeShortcuts = {
      csv: 'text/csv',
      json: 'application/json',
      txt: 'text/plain'
    };

    // State
    this.INIT = 0;
    this.WRITING = 1;
    this.DONE = 2;

    // Methods
    this.createBlob = function(data, mime, encoding) {
      mime = this.mimeShortcuts[mime] || mime || this.defaultMime;
      return new Blob(
        [data],
        {type: mime + ';charset=' + encoding || this.defaultEncoding}
      );
    };

    this.blobURL = function(blob) {
      var oURL = URL.createObjectURL(blob);
      this.deletionQueue.push(oURL);
      return oURL;
    };

    this.saveBlob = function(blob, filename) {
      this.readyState = this.INIT;

      var minSize = blob.size,
          saveLink = document.createElementNS(this.xmlns, 'a'),
          canUseSaveLink = !_root.externalHost && 'download' in saveLink;

      if (canUseSaveLink) {
        var oURL = this.blobURL(blob);

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
    };

    // Main interface
    this.save = function(data, params) {
      params = params || {};

      // Creating the blob
      var blob = this.createBlob(data, params.mime, params.encoding);

      // Saving the blob
      this.saveBlob(blob, params.filename || this.defaultFilename);
    };
  }

  var _saver = new Saver();

  // Exporting
  artoo.save = function(data, params) {
    params = params || {};

    _saver.save(
      data,
      params
    );
  };

  artoo.saveJson = function(data, params) {
    params = params || {};

    // Enforcing json
    if (typeof data !== 'string')
      if (params.pretty || params.indent)
        data = JSON.stringify(data, undefined, params.indent || 2);
      else
        data = JSON.stringify(data);
    else
      if (params.pretty || params.indent)
        data = JSON.stringify(JSON.parse(data), undefined, params.indent || 2);

    // Extending params
    params.filename = params.filename || 'data.json';
    params.mime = 'json';

    this.save(
      data,
      params
    );
  };

  artoo.savePrettyJson = function(data, params) {
    params = params || {};
    params.pretty = true;
    this.saveJson(data, params);
  };

  artoo.saveCsv = function(data, params) {
    params = params || {};

    if (typeof data !== 'string') {

      // We convert the array of arrays to a csv string
    }
  };
}).call(this);
// delim + escape
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
