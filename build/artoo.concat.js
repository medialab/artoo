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
  var exists = typeof artoo !== 'undefined' ||
               typeof detoo !== 'undefined',
      usurper = exists && artoo.passphrase !== 'detoo';

  if (exists && !usurper) {

    if (!artoo.settings.debug) {
      console.log('An artoo already works within this page. ' +
                  'No need to invoke another one.');
      return;
    }
  }

  if (usurper)
    console.log('An usurper artoo lives within this page. Let\'s shun it!');

  // Main namespace
  var artoo = {
    $: {},
    dom: document.getElementById('artoo_injected_script'),
    jquery: {
      export: function() {
        _root.ß = artoo.$;
      },
      plugins: []
    },
    loaded: false,
    passphrase: 'detoo',
    version: '0.0.1'
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
   * artoo settings
   * ===============
   *
   * artoo settings that may be set by user.
   */
  artoo.settings = {

    // Root settings
    autoInit: true,
    chromeExtension: false,
    debug: false,
    next: null,
    script: null,

    // Methods settings
    store: {
      engine: 'local'
    },
    log: {
      enabled: true,
      level: 'verbose'
    },
    instructions: {
      record: true
    },
    jquery: {
      version: '2.1.1'
    }
  };
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

  // Some function
  function some(a, fn) {
    for (var i = 0, l = a.length; i < l; i++) {
      if (fn(a[i]))
        return true;
    }
    return false;
  }

  // Convert an object into an array of its properties
  function objectToArray(o) {
    var a = [],
        i;
    for (i in o)
      a.push(o[i]);
    return a;
  }

  // Converting an array of arrays into a CSV string
  function toCSVString(data, delimiter, escape) {
    var header = [[]],
        oData,
        i;

    // Defaults
    escape = escape || '"';
    delimiter = delimiter || ',';

    // If the data is an array of objects
    if (artoo.$.isPlainObject(data[0])) {
      for (i in data[0])
        header[0].push(i);
      oData = header.concat(data.map(objectToArray));
    }

    // Converting to string
    return (oData || data).map(function(row) {
      return row.map(function(item) {
        item = item.replace(new RegExp(escape, 'g'), escape + escape);
        return ~item.indexOf(delimiter) || ~item.indexOf(escape) ?
          escape + item + escape :
          item;
      }).join(delimiter);
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
        head = document.getElementsByTagName('head')[0];

    // Defining the script tag
    script.src = url;
    script.onload = script.onreadystatechange = function() {
      if ((!this.readyState ||
            this.readyState == 'loaded' ||
            this.readyState == 'complete')) {
        script.onload = script.onreadystatechange = null;
        head.removeChild(script);

        if (typeof cb === 'function')
          cb();
      }
    };

    // Appending the script to head
    head.appendChild(script);
  }

  // Waiting for something to happen
  function waitFor(check, cb, params) {
    params = params || {};
    if (typeof cb === 'object') {
      params = cb;
      cb = params.done;
    }

    var milliseconds = params.interval || 30,
        j = 0;

    var i = setInterval(function() {
      if (check()) {
        cb();
        clearInterval(i);
      }

      if (params.timeout && params.timeout - (j * milliseconds) <= 0) {
        cb(false);
        clearInterval(i);
      }

      j++;
    }, milliseconds);
  }

  // Exporting to artoo root
  artoo.injectScript = getScript;
  artoo.waitFor = waitFor;

  // Exporting to artoo helpers
  artoo.helpers = {
    extend: extend,
    enforceSelector: enforceSelector,
    isSelector: isSelector,
    toCSVString: toCSVString,
    some: some
  };
}).call(this);

;(function(undefined) {
  'use strict';

  /**
   * artoo hooks
   * ============
   *
   * Utilities to triggers and apply artoo's hooks
   */
  artoo.hooks = {
    init: [],
    ready: [],
    trigger: function(hook) {
      if (!artoo.hooks[hook]) {
        artoo.log.error(
          'Trying to trigger an inexistant hook: "' + hook + '".');
        return;
      }

      artoo.hooks[hook].forEach(function(fn) {
        fn.apply(artoo);
      });
    }
  };

  // Add a function to be executed on the ready hook
  artoo.ready = function(fn) {
    if (typeof fn !== 'function') {
      artoo.log.error('Trying to add a non-function to the "ready" hook.');
      return;
    }

    artoo.hooks.ready.push(fn);
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
    verbose: '#33CCFF',
    debug: '#000099',
    info: '#009900',
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
    if (!artoo.settings.log.enabled)
      return;

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
    if (!artoo.settings.log.enabled)
      return;

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
    var desiredVersion = artoo.settings.jquery.version,
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
      artoo.injectScript(cdn, function() {
        artoo.log.warning(
          'Either jQuery has not a valid version or another library ' +
          'using dollar is already present. ' +
          'Exporting correct version to ß (or artoo.$).');

        artoo.$ = jQuery.noConflict(true);
        artoo.jquery.export();

        cb();
      });
    }

    // jQuery does not exist at all, we load it
    else {
      artoo.injectScript(cdn, function() {
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
   * artoo ajaxSpider method
   * ========================
   *
   * A useful method to scrape data from a list of ajax urls.
   */
  var _root = this;

  function loop(list, params, acc, i) {
    acc = acc || [];
    i = i || 0;

    var o = list[i];

    var get = (typeof o === 'string') ?
      function(c) {
        artoo.$.get(o, c);
      } :
      function(c) {
        artoo.$[o.method || 'get'](o.url, o.data || {}, c);
      };

    // Getting data with ajax
    if (params.throttle)
      setTimeout(get, params.throttle, dataRetrieved);
    else
      get(dataRetrieved);

    function dataRetrieved(data) {
      acc.push(params.callback(data));
      loop(list, params, acc, ++i);
    }
  }

  // TODO: Possibility for an iterator as list
  // TODO: list can be objects with url and data + get or post default get
  // TODO: throttle
  // TODO: if fn returns false or list run dry, we stop
  // TODO: asynchronous
  artoo.ajaxSpider = function(list, params, cb) {
    params = params || {};
    params.done = params.done || cb;

    loop(list, params);
  };
}).call(this);

;(function(undefined) {
  'use strict';

  /**
   * artoo autoExpand methods
   * =========================
   *
   * Some useful functions to expand programmatically some content in
   * the scraped web page.
   */
  var _root = this;

  function _expand(params, i, c) {
    i = i || 0;

    var canExpand = (params.canExpand) ?
      (typeof params.canExpand === 'string' ?
        artoo.$(params.canExpand).length > 0 :
        params.canExpand()) :
      true;

    // Is this over?
    if (!canExpand || i >= params.limit) {
      if (typeof params.done === 'function')
        params.done();
      return;
    }

    // Triggering expand
    var expandFn = (typeof params.expand === 'string') ?
      function() {
        artoo.$(params.expand).simulate('click');
      } :
      params.expand;

    if (params.throttle)
      setTimeout(expandFn, params.throttle);
    else
      expandFn();

    // Waiting expansion
    if (params.isExpanding) {

      // Checking whether the content is expanding and waiting for it to end.
      if (typeof params.isExpanding === 'number') {
        setTimeout(_expand, params.isExpanding, params, ++i);
      }
      else {
        var isExpanding = (typeof params.isExpanding === 'string') ?
          function() {
            return artoo.$(params.isExpanding).length > 0;
          } :
          params.isExpanding;

        artoo.waitFor(
          function() {
            return !isExpanding();
          },
          function() {
            _expand(params, ++i);
          },
          {timeout: params.timeout}
        );
      }
    }
    else if (params.elements) {
      c = c || artoo.$(params.elements).length;

      // Counting elements to check if those have changed
      artoo.waitFor(
        function() {
          return artoo.$(params.elements).length > c;
        },
        function() {
          _expand(params, ++i, artoo.$(params.elements).length);
        },
        {timeout: params.timeout}
      );
    }
    else {

      // No way to assert content changes, continuing...
      _expand(params, ++i);
    }
  }

  // TODO: throttle (make wrapper with setTimeout)
  artoo.autoExpand = function(params, cb) {
    params = params || {};
    params.done = cb || params.done;

    if (!params.expand) {
      artoo.log.error('You did not pass an expand parameter to artoo\'s' +
                      ' autoExpand method.');
      return;
    }

    _expand(params);
  };
}).call(this);

;(function(undefined) {
  'use strict';

  /**
   * artoo autoScroll methods
   * =========================
   *
   * Some useful functions to scroll programmatically the web pages you need
   * to scrape.
   */
  var _root = this;

  artoo.autoScroll = function(params, cb) {
    artoo.autoExpand(
      this.helpers.extend(params, {
        expand: function() {
          window.scrollTo(0, document.body.scrollHeight);
        }
      }),
      cb
    );
  };
}).call(this);

;(function(undefined) {


  /**
   * artoo instructions
   * ===================
   *
   * This utility is meant to record user console inputs in order to be able
   * to save them for later use.
   */
  var _root = this,
      _call = Function.prototype.call,
      _instructions = [],
      blackList = [
        'saveInstructions(',
        '.instructions'
      ],
      inChrome = 'chrome' in _root;

  // We override function calling to sniff user input
  if (inChrome) {

    Function.prototype.call = function() {
      if (arguments.length > 1 &&
          this.name === 'evaluate' &&
          arguments[0].constructor.name === 'InjectedScriptHost') {

        var input = arguments[1].split('\n').slice(1, -1).join('\n'),
            lastIndex = _instructions.length - 1;

        if (input !== 'this' &&
            !artoo.helpers.some(blackList, function(e) {
              return ~input.indexOf(e);
            }) &&
            input !== 'artoo') {
          if (~input.indexOf(_instructions[lastIndex]))
            _instructions[lastIndex] = input;
          else
            _instructions.push(input);
        }
      }

      return _call.apply(this, arguments);
    };
  }

  // artoo's methods
  artoo.instructions = function() {
    return artoo.instructions.get();
  };

  artoo.instructions.get = function() {

    // Filtering the array
    _instructions = _instructions.filter(function(e, i) {
      return (e !== _instructions[i - 1]);
    });

    return _instructions;
  };

  artoo.instructions.getScript = function() {
    return '// ' + window.location + '\n' +
           artoo.instructions.get().join('\n\n') + '\n';
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
    params = params || {};

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
    artoo.save(
      data,
      artoo.helpers.extend(params, {filename: 'data.json', mime: 'json'})
    );
  };

  artoo.savePrettyJson = function(data, params) {
    artoo.saveJson(data, artoo.helpers.extend(params, {pretty: true}));
  };

  artoo.saveCsv = function(data, params) {
    data = (typeof data !== 'string') ?
      artoo.helpers.toCSVString(data, params.delimiter, params.escape) :
      data;


    artoo.save(
      data,
      artoo.helpers.extend(params, {mime: 'csv', filename: 'data.csv'})
    );
  };

  artoo.saveHtml = function(data, params) {
    var selector = data.jquery !== undefined;
  };

  artoo.savePageHtml = function(params) {
    artoo.save(
      document.documentElement.innerHTML,
      artoo.helpers.extend(params, {mime: 'html', filename: 'page.html'})
    );
  };

  artoo.saveInstructions = function(params) {
    artoo.save(
      artoo.instructions.getScript(),
      artoo.helpers.extend(params, {
        mime: 'text/javascript',
        filename: 'artoo_script.js'
      })
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

  // Helpers
  function step(o, scope) {
    var $ = artoo.$,
        $sel = o.sel ? $(scope).find(o.sel) : $(scope);

    // Polymorphism
    if (typeof o === 'function') {
      return o.call(scope, $);
    }
    else if (typeof o === 'string') {
      if (o === 'text' || o === 'html')
        return $sel[o]();
      else
        return $sel.attr(o);
    }
    else {
      return (o.attr !== undefined) ?
        $sel.attr(o.attr) :
        $sel[o.method || 'text']();
    }
  }

  // TODO: recursive
  artoo.scrape = function(iterator, data, params, cb) {
    var scraped = [],
        loneSelector = !!data.attr || !!data.method ||
                       typeof data === 'string' ||
                       typeof data === 'function';

    params = params || {};

    // Transforming to selector
    var $iterator = this.helpers.enforceSelector(iterator);

    // Iteration
    $iterator.each(function(i) {
      var item = {},
          p;

      if (loneSelector)
        item = step(data, this);
      else
        for (p in data) {
          item[p] = step(data[p], this);
        }

      scraped.push(item);

      // Breaking if limit i attained
      return !params.limit || i < params.limit - 1;
    });

    scraped = params.one ? scraped[0] : scraped;

    // Triggering callback
    if (typeof params === 'function')
      params(scraped);
    else if (typeof params.done === 'function')
      params.done(scraped);
    else if (typeof cb === 'function')
      cb(scraped);

    // Returning data
    return scraped;
  };

  // Scrape only the first corresponding item
  artoo.scrapeOne = function(iterator, data, params, cb) {
    return artoo.scrape(
      iterator,
      data,
      artoo.helpers.extend({limit: 1, one: true}, params),
      cb
    );
  };
}).call(this);

;(function(undefined) {
  'use strict';

  /**
   * artoo persistent state
   * =======================
   *
   * artoo's persistent state abstraction. It populates itself if the state key
   * is present for the current page so the user might keep some data from page
   * to page.
   */
  var _root = this;

  // which store?
  // autoGet
  // set
  // key: %artoo% in settings
}).call(this);

;(function(undefined) {
  'use strict';

  /**
   * artoo store methods
   * ====================
   *
   * artoo's abstraction of HTML5's storage.
   */
  var _root = this;

  // Store alias
  // TODO: make a function if we wanted to change engine while artoo is running
  // or else if we'd need another store in the meantime.
  // OPTIMIZE: rewrite this part better.
  var settings = artoo.settings.store,
      engine = settings.engine,
      _store;

  if (engine === 'local')
    _store = localStorage;
  else if (engine === 'session')
    _store = sessionStorage;
  else
    artoo.log.error('Invalid store engine: "' + engine + '".');

  // Namespace
  artoo.store = function(key) {
    return artoo.store.get(key);
  };

  // Methods
  artoo.store.get = function(key) {
    return key ? JSON.parse(_store.getItem(key)) : artoo.store.getAll();
  };

  artoo.store.getAll = function() {
    var s = {};
    for (var i in _store)
      s[i] = artoo.store.get(i);
    return s;
  };

  artoo.store.keys = function(key) {
    var keys = [],
        i;
    for (i in _store)
      keys.push(i);

    return keys;
  };

  artoo.store.set = function(key, value) {
    if (typeof key !== 'string' && typeof key !== 'number') {
      artoo.log.error('Trying to set an invalid key to store. ' +
                      'Keys should be strings or numbers.');
      return;
    }

    // Storing
    _store.setItem(key, JSON.stringify(value));
  };

  artoo.store.pushTo = function(key, value) {
    var a = artoo.store.get(key);

    if (!$.isArray(a)) {
      artoo.log.error('Trying to push to a non-array for store key "' +
                      key + '".');
      return;
    }

    artoo.store.set(key, a.concat(value));
  };

  artoo.store.update = function(key, object) {
    var o = artoo.store.get(key);

    if (!artoo.$.isPlainObject(o)) {
      artoo.log.error('Trying to update a non-object for store key "' +
                      key + '".');
      return;
    }

    artoo.store.set(key, artoo.helpers.extend(object, o));
  };

  artoo.store.remove = function(key) {
    _store.removeItem(key);
  };

  artoo.store.removeAll = function() {
    for (var i in _store)
      _store.removeItem(i);
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
   * Launch artoo's init hooks.
   */

  // Initialization hook
  function main() {

    // Retrieving settings from script tag
    if (artoo.dom)
      artoo.settings = artoo.helpers.extend(
        JSON.parse(artoo.dom.getAttribute('settings')),
        artoo.settings
      );

    // Welcoming user
    this.log.welcome();

    // Indicating we are injecting artoo from the chrome extension
    if (artoo.settings.chromeExtension)
      artoo.log.verbose('artoo has automatically been injected ' +
                        'by the chrome extension.');

    // Injecting jQuery
    this.jquery.inject(function() {
      artoo.log.info('artoo is now good to go!');

      // Applying jQuery plugins
      artoo.jquery.plugins.map(function(p) {
        p(artoo.$);
      });

      // Loading extra script?
      if (artoo.settings.script)
        eval(artoo.settings.script);
      if (artoo.settings.next)
        artoo.injectScript(artoo.settings.next);


      // Triggering ready
      artoo.hooks.trigger('ready');
    });

    // Deleting artoo's dom element
    if (artoo.dom)
      artoo.dom.parentNode.removeChild(artoo.dom);

    // Updating artoo state
    this.loaded = true;
  }

  // Placing the hook at first position
  artoo.hooks.init.unshift(main);

  // Init?
  if (!artoo.loaded && artoo.settings.autoInit)
    artoo.hooks.trigger('init');
}).call(this);

/*
 * jquery.simulate - simulate browser mouse and keyboard events
 *
 * Copyright (c) 2009 Eduardo Lundgren (eduardolundgren@gmail.com)
 * and Richard D. Worth (rdworth@gmail.com)
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 */
;(function(undefined) {

  // Main plugin
  function _simulate($) {
    $.fn.extend({
      simulate: function(type, options) {
        return this.each(function() {
          var opt = $.extend({}, $.simulate.defaults, options || {});
          new $.simulate(this, type, opt);
        });
      }
    });

    $.simulate = function(el, type, options) {
      this.target = el;
      this.options = options;

      if (/^drag$/.test(type)) {
        this[type].apply(this, [this.target, options]);
      } else {
        this.simulateEvent(el, type, options);
      }
    };

    $.extend($.simulate.prototype, {
      simulateEvent: function(el, type, options) {
        var evt = this.createEvent(type, options);
        this.dispatchEvent(el, type, evt, options);
        return evt;
      },
      createEvent: function(type, options) {
        if (/^mouse(over|out|down|up|move)|(dbl)?click$/.test(type)) {
          return this.mouseEvent(type, options);
        } else if (/^key(up|down|press)$/.test(type)) {
          return this.keyboardEvent(type, options);
        }
      },
      mouseEvent: function(type, options) {
        var evt;
        var e = $.extend({
          bubbles: true, cancelable: (type != "mousemove"), view: window, detail: 0,
          screenX: 0, screenY: 0, clientX: 0, clientY: 0,
          ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
          button: 0, relatedTarget: undefined
        }, options);

        var relatedTarget = $(e.relatedTarget)[0];

        if ($.isFunction(document.createEvent)) {
          evt = document.createEvent("MouseEvents");
          evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail,
            e.screenX, e.screenY, e.clientX, e.clientY,
            e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
            e.button, e.relatedTarget || document.body.parentNode);
        } else if (document.createEventObject) {
          evt = document.createEventObject();
          $.extend(evt, e);
          evt.button = { 0:1, 1:4, 2:2 }[evt.button] || evt.button;
        }
        return evt;
      },
      keyboardEvent: function(type, options) {
        var evt;

        var e = $.extend({ bubbles: true, cancelable: true, view: window,
          ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
          keyCode: 0, charCode: 0
        }, options);

        if ($.isFunction(document.createEvent)) {
          try {
            evt = document.createEvent("KeyEvents");
            evt.initKeyEvent(type, e.bubbles, e.cancelable, e.view,
              e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
              e.keyCode, e.charCode);
          } catch(err) {
            evt = document.createEvent("Events");
            evt.initEvent(type, e.bubbles, e.cancelable);
            $.extend(evt, { view: e.view,
              ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey,
              keyCode: e.keyCode, charCode: e.charCode
            });
          }
        } else if (document.createEventObject) {
          evt = document.createEventObject();
          $.extend(evt, e);
        }
        if (($.browser !== undefined) && ($.browser.msie || $.browser.opera)) {
          evt.keyCode = (e.charCode > 0) ? e.charCode : e.keyCode;
          evt.charCode = undefined;
        }
        return evt;
      },

      dispatchEvent: function(el, type, evt) {
        if (el.dispatchEvent) {
          el.dispatchEvent(evt);
        } else if (el.fireEvent) {
          el.fireEvent('on' + type, evt);
        }
        return evt;
      },

      drag: function(el) {
        var self = this, center = this.findCenter(this.target), 
          options = this.options, x = Math.floor(center.x), y = Math.floor(center.y), 
          dx = options.dx || 0, dy = options.dy || 0, target = this.target;
        var coord = { clientX: x, clientY: y };
        this.simulateEvent(target, "mousedown", coord);
        coord = { clientX: x + 1, clientY: y + 1 };
        this.simulateEvent(document, "mousemove", coord);
        coord = { clientX: x + dx, clientY: y + dy };
        this.simulateEvent(document, "mousemove", coord);
        this.simulateEvent(document, "mousemove", coord);
        this.simulateEvent(target, "mouseup", coord);
      },
      findCenter: function(el) {
        var el = $(this.target), o = el.offset();
        return {
          x: o.left + el.outerWidth() / 2,
          y: o.top + el.outerHeight() / 2
        };
      }
    });

    $.extend($.simulate, {
      defaults: {
        speed: 'sync'
      },
      VK_TAB: 9,
      VK_ENTER: 13,
      VK_ESC: 27,
      VK_PGUP: 33,
      VK_PGDN: 34,
      VK_END: 35,
      VK_HOME: 36,
      VK_LEFT: 37,
      VK_UP: 38,
      VK_RIGHT: 39,
      VK_DOWN: 40
    });
  }

  // Exporting
  artoo.jquery.plugins.push(_simulate);
}).call(this);
