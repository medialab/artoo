;(function(undefined) {
  'use strict';

  /**
   * artoo helpers
   * ==============
   *
   * Some useful helpers.
   */
  var _root = this;

  /**
   * Generic Helpers
   * ----------------
   *
   * Some basic helpers from collection handling to type checking.
   */

  // Recursively extend objects
  function extend() {
    var i,
        k,
        res = {},
        l = arguments.length;

    for (i = l - 1; i >= 0; i--)
      for (k in arguments[i])
        if (res[k] && isPlainObject(arguments[i][k]))
          res[k] = extend(arguments[i][k], res[k]);
        else
          res[k] = arguments[i][k];

    return res;
  }

  // Useless function
  function noop() {}

  // Creating repeating sequences
  function repeatString(string, nb) {
    var s = string,
        l,
        i;

    if (nb <= 0)
      return '';

    for (i = 1, l = nb | 0; i < l; i++)
      s += string;
    return s;
  }

  // Is the var an array?
  function isArray(v) {
    return v instanceof Array;
  }

  // Is the var an object?
  function isObject(v) {
    return v instanceof Object;
  }

  // Is the var a real NaN
  function isRealNaN(v) {
    return isNaN(v) && (typeof v === 'number');
  }

  // Is the var a plain object?
  function isPlainObject(v) {
    return v instanceof Object &&
           !(v instanceof Array) &&
           !(v instanceof Function);
  }

  // Is nonscalar value?
  function isNonScalar(v) {
    return isPlainObject(v) || isArray(v);
  }

  // Is a value scalar?
  function isScalar(v) {
    return !isNonScalar(v);
  }

  // Get first item of array returning true to given function
  function first(a, fn, scope) {
    for (var i = 0, l = a.length; i < l; i++) {
      if (fn.call(scope || null, a[i]))
        return a[i];
    }
    return;
  }

  // Convert an object into an array of its properties
  function objectToArray(o, order) {
    order = order || Object.keys(o);

    return order.map(function(k) {
      return o[k];
    });
  }

  // Retrieve an index of keys present in an array of objects
  function keysIndex(a) {
    var keys = [],
        l,
        k,
        i;

    for (i = 0, l = a.length; i < l; i++)
      for (k in a[i])
        if (!~keys.indexOf(k))
          keys.push(k);

    return keys;
  }

  // Escape a string for a RegEx
  function rescape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  // Converting an array of arrays into a CSV string
  function toCSVString(data, params) {
    params = params || {};

    var header = params.headers || [],
        plainObject = isPlainObject(data[0]),
        keys = plainObject && (params.order || keysIndex(data)),
        oData,
        i;

    // Defaults
    var escape = params.escape || '"',
        delimiter = params.delimiter || ',';

    // Dealing with headers polymorphism
    if (!header.length)
      if (plainObject && params.headers !== false)
        header = keys;

    // Should we append headers
    oData = (header.length ? [header] : []).concat(
      plainObject ?
        data.map(function(e) { return objectToArray(e, keys); }) :
        data
    );

    // Converting to string
    return oData.map(function(row) {
      return row.map(function(item) {

        // Wrapping escaping characters
        var i = ('' + (typeof item === 'undefined' ? '' : item)).replace(
          new RegExp(rescape(escape), 'g'),
          escape + escape
        );

        // Escaping if needed
        return ~i.indexOf(delimiter) || ~i.indexOf(escape) || ~i.indexOf('\n') ?
          escape + i + escape :
          i;
      }).join(delimiter);
    }).join('\n');
  }

  // Characters to escape in YAML
  var ymlEscape = /[:#,\-\[\]\{\}&%]|!{1,2}/;

  // YAML conversion
  var yml = {
    string: function(string) {
      return (~string.search(ymlEscape)) ?
        '\'' + string.replace(/'/g, '\'\'') + '\'' :
        string;
    },
    number: function(nb) {
      return '' + nb;
    },
    array: function(a, lvl) {
      lvl = lvl || 0;

      if (!a.length)
        return '[]';

      var string = '',
          l,
          i;

      for (i = 0, l = a.length; i < l; i++) {
        string += repeatString('  ', lvl);

        if (isScalar(a[i])) {
          string += '- ' + processYAMLVariable(a[i]) + '\n';
        }
        else {
          if (isPlainObject(a[i]))
            string += '-' + processYAMLVariable(a[i], lvl + 1, true);
          else
            string += processYAMLVariable(a[i], lvl + 1);
        }
      }

      return string;
    },
    object: function(o, lvl, indent) {
      lvl = lvl || 0;

      if (!Object.keys(o).length)
        return (lvl ? '- ' : '') + '{}';

      var string = '',
          key,
          c = 0,
          i;

      for (i in o) {
        key = yml.string(i);
        string += repeatString('  ', lvl);
        if (indent && !c)
          string = string.slice(0, -1);
        string += key + ': ' + (isNonScalar(o[i]) ? '\n' : '') +
          processYAMLVariable(o[i], lvl + 1) + '\n';

        c++;
      }

      return string;
    },
    fn: function(fn) {
      return yml.string(fn.toString());
    },
    boolean: function(v) {
      return '' + v;
    },
    nullValue: function(v) {
      return '~';
    }
  };

  // Get the correct handler corresponding to variable type
  function processYAMLVariable(v, lvl, indent) {

    // Scalars
    if (typeof v === 'string')
      return yml.string(v);
    else if (typeof v === 'number')
      return yml.number(v);
    else if (typeof v === 'boolean')
      return yml.boolean(v);
    else if (typeof v === 'undefined' || v === null || isRealNaN(v))
      return yml.nullValue(v);

    // Nonscalars
    else if (isPlainObject(v))
      return yml.object(v, lvl, indent);
    else if (isArray(v))
      return yml.array(v, lvl);
    else if (typeof v === 'function')
      return yml.fn(v);

    // Error
    else
      throw TypeError('artoo.helpers.toYAMLString: wrong type.');
  }

  // Converting JavaScript variables to a YAML string
  function toYAMLString(data) {
    return '---\n' + processYAMLVariable(data);
  }

  // Checking whether a variable is a jQuery selector
  function isSelector(v) {
    return (artoo.$ && v instanceof artoo.$) ||
           (jQuery && v instanceof jQuery) ||
           ($ && v instanceof $);
  }

  // Checking whether a variable is a DOM document
  function isDocument(v) {
    return v instanceof HTMLDocument ||
           v instanceof XMLDocument;
  }

  // Get either string or document and return valid jQuery selection
  function jquerify(v) {
    var $ = artoo.$;

    if (typeof v === 'string') {
      try {
        if (artoo.browser.phantomjs)
          throw Error('next');
        return $($.parseXML(v).documentElement);
      }
      catch (x) {
        try {
          return $(createDocument().documentElement).append(v);
        }
        catch (x) {
          return $(v);
        }
      }
    }
    else {
      return $(v);
    }
  }

  // Creating an HTML or XML document
  function createDocument(root, namespace) {
    if (!root)
      return document.implementation.createHTMLDocument();
    else
      return document.implementation.createDocument(
        namespace || null,
        root,
        null
      );
  }

  // Loading an external file the same way the browser would load it from page
  function getScript(url, async, cb) {
    if (typeof async === 'function') {
      cb = async;
      async = false;
    }

    var el = document.createElement('script');

    // Script attributes
    el.type = 'text/javascript';
    el.src = url;

    // Should the script be loaded asynchronously?
    if (async)
      el.async = true;

    // Defining callbacks
    el.onload = el.onreadystatechange = function() {
      if ((!this.readyState ||
            this.readyState == 'loaded' ||
            this.readyState == 'complete')) {
        el.onload = el.onreadystatechange = null;

        // Removing element from head
        artoo.mountNode.removeChild(el);

        if (typeof cb === 'function')
          cb();
      }
    };

    // Appending the script to head
    artoo.mountNode.appendChild(el);
  }

  // Loading an external stylesheet
  function getStylesheet(data, isUrl, cb) {
    var el = document.createElement(isUrl ? 'link' : 'style'),
        head = document.getElementsByTagName('head')[0];

    el.type = 'text/css';

    if (isUrl) {
      el.href = data;
      el.rel = 'stylesheet';

      // Waiting for script to load
      el.onload = el.onreadystatechange = function() {
        if ((!this.readyState ||
              this.readyState == 'loaded' ||
              this.readyState == 'complete')) {
          el.onload = el.onreadystatechange = null;

          if (typeof cb === 'function')
            cb();
        }
      };
    }
    else {
      el.innerHTML = data;
    }

    // Appending the stylesheet to head
    head.appendChild(el);
  }

  var globalsBlackList = [
    '__commandLineAPI',
    'applicationCache',
    'chrome',
    'closed',
    'console',
    'crypto',
    'CSS',
    'defaultstatus',
    'defaultStatus',
    'devicePixelRatio',
    'document',
    'external',
    'frameElement',
    'history',
    'indexedDB',
    'innerHeight',
    'innerWidth',
    'length',
    'localStorage',
    'location',
    'name',
    'offscreenBuffering',
    'opener',
    'outerHeight',
    'outerWidth',
    'pageXOffset',
    'pageYOffset',
    'performance',
    'screen',
    'screenLeft',
    'screenTop',
    'screenX',
    'screenY',
    'scrollX',
    'scrollY',
    'sessionStorage',
    'speechSynthesis',
    'status',
    'styleMedia'
  ];

  function getGlobalVariables() {
    var p = Object.getPrototypeOf(_root),
        o = {},
        i;

    for (i in _root)
      if (!~i.indexOf('webkit') &&
          !(i in p) &&
          _root[i] !== _root &&
          !(_root[i] instanceof BarProp) &&
          !(_root[i] instanceof Navigator) &&
          !~globalsBlackList.indexOf(i))
        o[i] = _root[i];

    return o;
  }

  /**
   * Async Helpers
   * --------------
   *
   * Some helpful functions to deal with asynchronous matters.
   */

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

  // Dispatch asynchronous function
  function async() {
    var args = Array.prototype.slice.call(arguments);
    return setTimeout.apply(null, [args[0], 0].concat(args.slice(1)));
  }

  // Launching tasks in parallel with an optional limit
  function parallel(tasks, params, last) {
    var onEnd = (typeof params === 'function') ? params : params.done || last,
        running = [],
        results = [],
        d = 0,
        t,
        l,
        i;

    if (typeof onEnd !== 'function')
      onEnd = noop;

    function cleanup() {
      running.forEach(function(r) {
        clearTimeout(r);
      });
    }

    function onTaskEnd(err, result) {
      // Adding results to accumulator
      results.push(result);

      if (err) {
        cleanup();
        return onEnd(err, results);
      }

      if (++d >= tasks.length) {

        // Parallel action is finished, returning
        return onEnd(null, results);
      }

      // Adding on stack
      t = tasks[i++];
      running.push(async(t, onTaskEnd));
    }

    for (i = 0, l = params.limit || tasks.length; i < l; i++) {
      t = tasks[i];

      // Dispatching the function asynchronously
      running.push(async(t, onTaskEnd));
    }
  }

  /**
   * Monkey Patching
   * ----------------
   *
   * Some monkey patching shortcuts. Useful for sniffers and overriding
   * native functions.
   */

  // TODO: return value
  function before(targetFunction, beforeFunction) {

    // Replacing the target function
    var newFunction = function() {

      // Applying our function
      beforeFunction.apply(null, arguments);

      // Applying the original function
      targetFunction.apply(null, arguments);
    };

    return newFunction;
  }

  /**
   * Exportation
   * ------------
   */

  // Exporting to artoo root
  artoo.injectScript = function(url, cb) {
    getScript(url, cb);
  };
  artoo.injectStyle = function(url, cb) {
    getStylesheet(url, true, cb);
  };
  artoo.injectInlineStyle = function(text) {
    getStylesheet(text, false);
  };
  artoo.waitFor = waitFor;
  artoo.getGlobalVariables = getGlobalVariables;

  // Exporting to artoo helpers
  artoo.helpers = {
    before: before,
    createDocument: createDocument,
    extend: extend,
    first: first,
    isArray: isArray,
    isDocument: isDocument,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isRealNaN: isRealNaN,
    isSelector: isSelector,
    isNonScalar: isNonScalar,
    isScalar: isScalar,
    jquerify: jquerify,
    noop: noop,
    parallel: parallel,
    toCSVString: toCSVString,
    toYAMLString: toYAMLString
  };
}).call(this);
