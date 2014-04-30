;(function(undefined) {
  'use strict';

  /**
   * artoo core
   * ===========
   *
   * The main artoo namespace and its vital properties.
   */
  var _root = this;

  // Checking preexistence of artoo and potential usurpation
  var exists = typeof _root.artoo !== 'undefined' ||
               typeof _root.detoo !== 'undefined',
      usurper = exists && _root.artoo.passphrase !== 'detoo',
      name;

  if (exists && !usurper) {
    console.log('An artoo already works within this page. ' +
                'No need to invoke another one.');
    return;
  }

  if (usurper)
    console.log('An usurper artoo lives within this page. Let\'s shun it!');

  // Main namespace
  var artoo = {
    $: {},
    version: '0.0.1',
    passphrase: 'detoo',
    loaded: false,
    hooks: {
      init: []
    },
    jquery: {
      version: '2.1.0',
      export: function() {
        _root.ß = artoo.$;
      }
    }
  };

  // Exporting to global scope
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

  // Checking whether a variable is a jQuery selector
  function isSelector(v) {
    return (artoo.$ && v instanceof artoo.$) ||
           (ß && v instanceof ß) ||
           (jQuery && v instanceof jQuery) ||
           ($ && v instanceof $);
  }

  // Enforce to selector
  function enforceSelector(v) {
    return (isSelector(v)) ? v : artoo.$(v);
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

  // Exporting to artoo root
  artoo.getScript = getScript;

  // Exporting to artoo helpers
  artoo.helpers = {
    extend: extend,
    enforceSelector: enforceSelector,
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
    warning: 'orange',
    error: 'red'
  };

  // Log header
  function logHeader(level) {
    return [
      '[artoo]: %c' + level,
      'color: ' + levels[level] + ';',
      '-'
    ];
  }

  // Log override
  artoo.log = function(level) {
    var hasLevel = (levels[level] !== undefined),
        slice = hasLevel ? 1 : 0,
        args = toArray(arguments, slice);

    level = hasLevel ? level : 'debug';

    console.log.apply(
      console,
      logHeader(level).concat(args)
    );
  };

  // Log shortcuts
  function makeShortcut(level) {
    artoo.log[level] = function() {
      artoo.log.apply(artoo.log,
        [level].concat(toArray(arguments)));
    };
  }

  for (var l in levels)
    makeShortcut(l);

  // Logo display
  artoo.log.welcome = function() {
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
  artoo.jquery.inject = function(cb) {

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
      artoo.log.verbose('jQuery already exists in this page ' +
                        '(v' + currentVersion + '). No need to load it again.');

      // Internal reference
      artoo.$ = jQuery;
      artoo.jquery.export();

      cb();
    }

    // jQuery has not the correct version or another library uses $
    else if ((exists && currentVersion.charAt(0) !== '2') || other) {
      artoo.getScript(cdn, function() {
        artoo.log.warning(
          'Either jQuery has not a valid version or another library ' +
          'using dollar is already present.\n' +
          'Exporting correct version to ß (or artoo.$).');

        artoo.$ = jQuery.noConflict(true);
        artoo.jquery.export();

        cb();
      });
    }

    // jQuery does not exist at all, we load it
    else {
      artoo.getScript(cdn, function() {
        artoo.log.info('jQuery was correctly injected into your page ' +
                       '(v' + desiredVersion + ').');

        artoo.$ = jQuery;
        artoo.jquery.export();

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
  artoo.save = function(data, params) {
    _saver.save(data, params);
  };

  artoo.saveJson = function(data, params) {

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
    this.save(
      data,
      this.helpers.extend(params, {filename: 'data.json', mime: 'json'})
    );
  };

  artoo.savePrettyJson = function(data, params) {
    this.saveJson(data, this.helpers.extend(params, {pretty: true}));
  };

  artoo.saveCsv = function(data, params) {
    data = (typeof data === 'string') ? data : this.helpers.toCSVString(data);

    this.save(
      data,
      this.helpers.extend(params, {mime: 'csv', filename: 'data.csv'})
    );
  };

  artoo.saveHtml = function(data, params) {
    var selector = data.jquery !== undefined;
  };

  artoo.savePageHtml = function(params) {
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

  // TODO: recursive
  artoo.scrape = function(iterator, data, params) {
    params = params || {};

    var $ = this.$,
        scraped = [];

    // Transforming to selector
    var $iterator = this.helpers.enforceSelector(iterator);

    // Iteration
    $iterator.each(function() {
      var $sel,
          item = {},
          o,
          i;

      for (i in data) {
        o = data[i];

        // Polymorphism
        if ($.isFunction(o)) {
          item[i] = o.call(this, $);
        }
        else {
          $sel = $(this).find(o.sel);
          item[i] = (o.attr !== undefined) ?
            $sel.attr(o.attr) :
            $sel[o.method || 'text']();
        }
      }

      scraped.push(item);
    });

    // Returning and done callback
    if ($.isFunction(params.done))
      params.done(scraped);

    return scraped;
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
  artoo.store = {};

  // Testing for the availablity of the localStorage
  artoo.store.available = 'localStorage' in _root;
  if (!artoo.store.available)
    artoo.hooks.init.push(function() {
      this.log.warning(
        'localStorage not available. You might want to upgrade ' +
        'your browser.'
      );
    });

  // Utilities
  function coerce(value, type) {
    if (type === 'boolean')
      value = (value === 'true');
    else if (type === 'number')
      value = +value;
    else if (type === 'object')
      value = JSON.parse(value);
    return value;
  }

  // TODO: automatic typing
  // TODO: used space

  // Methods
  artoo.store.get = function(key, type) {
    var value = localStorage.getItem(key);
    return value !== null ? coerce(value, type || 'string') : value;
  };

  artoo.store.getNumber = function(key) {
    return this.get(key, 'number');
  };

  artoo.store.getBoolean = function(key) {
    return this.get(key, 'boolean');
  };

  artoo.store.getObject = function(key) {
    return this.get(key, 'object');
  };

  artoo.store.keys = function(key) {
    var keys = [],
        i;
    for (i in localStorage)
      keys.push(i);

    return keys;
  };

  artoo.store.getAll = function() {
    var store = {};
    for (var i in localStorage)
      store[i] = this.get(i);
    return store;
  };

  artoo.store.set = function(key, value, o) {
    if (typeof key !== 'string' && typeof key !== 'number') {
      artoo.log.error('Trying to set an invalid key to localStorage. ' +
                      'Keys should be strings or numbers.');
      return;
    }
    localStorage.setItem(key, o ? JSON.stringify(value) : '' + value);
  };

  artoo.store.setObject = function(key, value) {
    this.set(key, value, true);
  };

  artoo.store.push = function(key, value) {
    var a = this.getObject(key);

    if (!$.isArray(a)) {
      artoo.log.error('Trying to push to a non-array for localStorage key "' +
                      key + '".');
      return;
    }

    a.push(value);
    this.setObject(key, a);
  };

  artoo.store.update = function(key, object) {
    var o = this.getObject(key);

    if (!artoo.$.isPlainObject(o)) {
      artoo.log.error('Trying to update a non-object for localStorage key "' +
                      key + '".');
      return;
    }

    this.setObject(key, artoo.helpers.extend(object, o));
  };

  artoo.store.remove = function(key) {
    localStorage.removeItem(key);
  };

  artoo.store.removeAll = function() {
    for (var i in localStorage)
      localStorage.removeItem(i);
  };

  // Shortcut
  artoo.s = artoo.store;
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

  // Initialization hook
  function main() {

    // Welcoming user
    this.log.welcome();

    // Injecting jQuery
    this.jquery.inject(function() {
      artoo.log.info('artoo is now good to go!');

      // Triggering ready
      if (artoo.$.isFunction(artoo.ready))
        artoo.ready();
    });

    // Updating artoo state
    this.loaded = true;
  }

  // Placing the hook at first position
  artoo.hooks.init.unshift(main);

  // Init?
  if (!artoo.loaded)
    artoo.hooks.init.map(function(h) {
      h.apply(artoo, h);
    });
}).call(this);
