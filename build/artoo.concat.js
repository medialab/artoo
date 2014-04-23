;(function(undefined) {
  'use strict';

  /**
   * artoo core
   * ===========
   *
   * The main artoo namespace and its vital properties.
   */
  var _root = this;

  // Main object
  var Artoo = function(proxyName) {
    var _this = this;

    // Properties
    this.$ = null;
    this.version = '0.0.1';
    this.name = proxyName || 'artoo';
    this.passphrase = 'detoo';
    this.jquery = {
      version: '2.1.0',
      export: function() {
        _root.ß = _this.$;
      }
    };

    // Settings
    this.settings = {
      logLevel: 'verbose'
    };

    this.helpers = Artoo.helpers;

    this.init();
  };

  // Main prototype methods
  Artoo.prototype.init = function() {
    var _this = this;

    // Welcoming user
    this.welcome();

    // Injecting jQuery
    this.inject(function() {
      _this.log(_this.name + ' is now good to go!');
    });
  };

  if (typeof this.exports !== 'undefined') {
    if (typeof this.module !== 'undefined' && this.module.exports)
      this.exports = this.module.exports = Artoo;
    this.exports.Artoo = Artoo;
  }
  this.Artoo = Artoo;
}).call(this);

;(function(undefined) {
  'use strict';

  /**
   * artoo helpers
   * ==============
   *
   * Some useful helpers.
   */

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

  // Converting an array of arrays into a CSV string
  // TODO: escape character
  function toCSVString(data, delimiter, escape) {
    return data.map(function(row) {
      return row.join(delimiter || ',');
    }).join('\n');
  }

  // Loading an external script
  Artoo.prototype.getScript = function(url, cb) {
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
  };

  // Exporting
  Artoo.helpers = {
    extend: extend,
    toCSVString: toCSVString
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

  // Utilities
  function toArray(a, slice) {
    return Array.prototype.slice.call(a, slice || 0);
  }

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

  // Log levels
  var levels = {
    verbose: 'cyan',
    debug: 'blue',
    info: 'green',
    warn: 'orange',
    error: 'red'
  };

  // Log header
  function logHeader(name, level) {
    return [
      '[' + name + ']: %c' + level,
      'color: ' + levels[level] + ';',
      '-'
    ];
  }

  // Log override
  Artoo.prototype.log = function(level) {
    var hasLevel = (levels[level] !== undefined),
        slice = hasLevel ? 1 : 0,
        args = Array.prototype.slice.call(arguments, slice);

    level = hasLevel ? level : 'debug';

    console.log.apply(
      console,
      logHeader(this.name, level).concat(args)
    );
  };

  // Log shortcuts
  function makeShortcut(level) {
    Artoo.prototype[level] = function() {
      this.log.apply(this,
        [level].concat(Array.prototype.slice.call(arguments)));
    };
  }

  for (var l in levels)
    makeShortcut(l);

  // Logo display
  Artoo.prototype.welcome = function() {
    var ascii = robot();

    ascii[ascii.length - 2] = ascii[ascii.length - 2] + '    ' + this.name;

    console.log(ascii.join('\n') + '   v' + this.version);
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

  Artoo.prototype.inject = function(cb) {
    var _this = this;

    // Properties
    var desiredVersion = this.jquery.version,
        cdn = '//code.jquery.com/jquery-' + desiredVersion + '.min.js';

    // Checking the existence of jQuery or of another library.
    var exists = typeof jQuery !== 'undefined',
        other = !exists && typeof $ === 'function',
        currentVersion = exists ? jQuery.fn.jquery : '0',
        chromeAPI = typeof $$ !== 'undefined' &&
          !!~$$.toString().indexOf('[Command Line API]');

    // jQuery is already in a correct mood
    if (exists && currentVersion.charAt(0) === '2') {
      this.log('jQuery already exists in this page ' +
                '(v' + currentVersion + '). No need to load it again.');

      // Internal reference
      this.$ = jQuery;

      cb();
    }

    // jQuery has not the correct version or another library uses $
    else if ((exists && currentVersion.charAt(0) !== '2') || other) {
      this.getScript(cdn, function() {
        _this.log(
          'Either jQuery has not a valid version or another library ' +
          'using dollar is already present.\n' +
          'Exporting correct version to ß (or ' + _this.name + '.$).');

        _this.$ = jQuery.noConflict(true);
        _this.jquery.export();

        cb();
      });
    }

    // jQuery does not exist at all, we load it
    else {
      this.getScript(cdn, function() {
        _this.log('jQuery was correctly injected into your page ' +
                  '(v' + desiredVersion + ').');

        _this.$ = jQuery;

        cb();
      });
    }
  };
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
      txt: 'text/plain',
      html: 'text/html'
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
  Artoo.prototype.save = function(data, params) {
    _saver.save(data, params);
  };

  Artoo.prototype.saveJson = function(data, params) {

    // Enforcing json
    if (typeof data !== 'string') {
      if (params.pretty || params.indent)
        data = JSON.stringify(data, undefined, params.indent || 2);
      else
        data = JSON.stringify(data);
    }
    else {
      if (params.pretty || params.indent)
        data = JSON.stringify(JSON.parse(data), undefined, params.indent || 2);
    }

    // Extending params
    this.save(data, this.extend(params, {filename: 'data.json', mime: 'json'}));
  };

  Artoo.prototype.savePrettyJson = function(data, params) {
    this.saveJson(data, this.helpers.extend(params, {pretty: true}));
  };

  Artoo.prototype.saveCsv = function(data, params) {
    data = (typeof data === 'string') ? data : this.helpers.toCSVString(data);

    this.save(
      data,
      this.helpers.extend(params, {mime: 'csv', filename: 'data.csv'})
    );
  };

  Artoo.prototype.saveHtml = function(data, params) {
    var selector = data.jquery !== undefined;
  };

  Artoo.prototype.savePageHtml = function(params) {
    this.save(
      document.documentElement.innerHTML,
      this.helpers.extend(params, {mime: 'html', filename: 'page.html'})
    );
  };
}).call(this);

;(function(undefined) {
  'use strict';

  /**
   * artoo scrape methods
   * =====================
   *
   * Some scraping helpers.
   */
  var _root = this;

  Artoo.prototype.scrape = function(sel, params) {

  };
}).call(this);

;(function(undefined) {
  'use strict';

  /**
   * artoo store methods
   * ====================
   *
   * artoo's abstraction of HTML5's local storage.
   */
  var _root = this;
}).call(this);

;(function(undefined) {
  'use strict';

  /**
   * artoo initialization
   * =====================
   *
   * Loading a single instance of artoo into the web page while checking for
   * potential usurpers and acting accordingly.
   */

  // Checking preexistence of artoo and potential usurpation
  var exists = typeof this.artoo !== 'undefined' ||
               typeof this.detoo !== 'undefined',
      usurper = exists && this.artoo.passphrase !== 'detoo',
      name;

  if (exists && !usurper) {
    console.log('An artoo already works within this page.' +
                'no need to invoke another one.');
    return;
  }

  if (usurper) {
    console.log('An usurper artoo lives within this page. Renaming artoo ' +
                'to "detoo".');
    name = 'detoo';
  }
  else {
    name = 'artoo';
  }

  // Exporting
  this[name] = new Artoo(name);
}).call(this);
