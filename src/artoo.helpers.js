;(function(undefined) {
  'use strict';

  /**
   * artoo helpers
   * ==============
   *
   * Some useful helpers.
   */
  var _root = this;

  // Extending Emmett
  Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
  };
  var ee = new artoo.emitter();
  Object.setPrototypeOf(artoo, Object.getPrototypeOf(ee));


  // Legacy support
  // TODO: drop this asap
  artoo.hooks = {
    trigger: function(name) {
      artoo.emit(name);
    }
  };


  /**
   * Generic Helpers
   * ----------------
   *
   * Some basic helpers from collection handling to type checking.
   */

  // Useless function
  function noop() {}

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

  // Is a var non primitive?
  function isNonPrimitive(v) {
    return isPlainObject(v) || isArray(v);
  }

  // Is a var primitive?
  function isPrimitive(v) {
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

  // Get the index of an element in an array by function
  function indexOf(a, fn, scope) {
    for (var i = 0, l = a.length; i < l; i++) {
      if (fn.call(scope || null, a[i]))
        return i;
    }
    return -1;
  }

  // Retrieve a file extenstion from filename or url
  function getExtension(url) {
    var a = url.split('.');

    if (a.length === 1 || (a[0] === '' && a.length === 2))
      return '';
    return a.pop();
  }

  /**
   * Document Helpers
   * -----------------
   *
   * Functions to deal with DOM selection and the current document.
   */

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

    if (isDocument(v))
      return $(v);
    return $('<div />').append(v);
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
        clearInterval(i);
        cb(null);
      }

      if (params.timeout && params.timeout - (j * milliseconds) <= 0) {
        clearInterval(i);
        cb(new Error('timeout'));
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

  function before(targetFunction, beforeFunction) {

    // Replacing the target function
    return function() {

      // Applying our function
      beforeFunction.apply(this, Array.prototype.slice.call(arguments));

      // Applying the original function
      return targetFunction.apply(this, Array.prototype.slice.call(arguments));
    };
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
    getExtension: getExtension,
    indexOf: indexOf,
    isArray: isArray,
    isDocument: isDocument,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isRealNaN: isRealNaN,
    isSelector: isSelector,
    isNonPrimitive: isNonPrimitive,
    isPrimitive: isPrimitive,
    jquerify: jquerify,
    noop: noop,
    parallel: parallel
  };
}).call(this);
