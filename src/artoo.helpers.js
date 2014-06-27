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
  function first(a, fn) {
    for (var i = 0, l = a.length; i < l; i++) {
      if (fn(a[i]))
        return a[i];
    }
    return;
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
    if (isPlainObject(data[0])) {
      for (i in data[0])
        header[0].push(i);
      oData = header.concat(data.map(objectToArray));
    }

    // Converting to string
    return (oData || data).map(function(row) {
      return row.map(function(item) {
        item = ('' + item).replace(new RegExp(escape, 'g'), escape + escape);
        return ~item.indexOf(delimiter) || ~item.indexOf(escape) ?
          escape + item + escape :
          item;
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
  function getExternal(url, type, cb) {
    type = type || 'js';

    if (type !== 'js' && type !== 'css')
      throw TypeError('artoo.getExternal: invalid type "' + type + '".');

    var el = document.createElement(type === 'js' ? 'script' : 'link'),
        head = document.getElementsByTagName('head')[0];

    // Defining the script tag
    el[type === 'js' ? 'src' : 'href'] = url;
    if (type === 'css') {
      el.type = 'text/css';
      el.rel = 'stylesheet';
    }

    // Defining callbacks
    el.onload = el.onreadystatechange = function() {
      if ((!this.readyState ||
            this.readyState == 'loaded' ||
            this.readyState == 'complete')) {
        el.onload = el.onreadystatechange = null;

        // Removing only if Javascript
        if (type === 'js')
          head.removeChild(el);

        if (typeof cb === 'function')
          cb();
      }
    };

    // Appending the script to head
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
   * File handling
   * --------------
   *
   * Functions dealing with file issues such as converting images into dataURI.
   */

  // Retrieve a file extenstion from filename or url
  function getExtension(url) {
    var a = url.split('.');

    if (a.length === 1 || (a[0] === '' && a.length === 2))
      return '';
    return a.pop();
  }

  var imageMimes = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif'
  };

  // Convert an image into a dataUrl
  function imgToDataUrl(img) {
    var $img = artoo.$(img);

    // Do we know the mime type of the image?
    var mime = imageMimes[getExtension($img.attr('src')) || 'png'];

    // Creating dummy canvas
    var canvas = document.createElement('canvas');
    canvas.width = $img[0].naturalWidth;
    canvas.height = $img[0].naturalHeight;

    // Copy the desired image to a canvas
    var ctx = canvas.getContext('2d');
    ctx.drawImage($img[0], 0, 0);
    var dataUrl = canvas.toDataURL(mime);

    // Clean up
    canvas = null;

    // Returning the url
    return dataUrl;
  }

  // Exporting to artoo root
  artoo.injectScript = function(url, cb) {
    getExternal(url, 'js', cb);
  };
  artoo.injectStyle = function(url, cb) {
    getExternal(url, 'css', cb);
  };
  artoo.waitFor = waitFor;
  artoo.getGlobalVariables = getGlobalVariables;

  // Exporting to artoo helpers
  artoo.helpers = {
    createDocument: createDocument,
    extend: extend,
    first: first,
    getExtension: getExtension,
    imgToDataUrl: imgToDataUrl,
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
