;(function(undefined) {
  'use strict';

  /**
   * artoo helpers
   * ==============
   *
   * Some useful helpers.
   */
  var _root = this;

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

  // Is the var an array?
  function isArray(v) {
    return v instanceof Array;
  }

  // Is the var an object?
  function isObject(v) {
    return v instanceof Object;
  }

  // Is the var a plain object?
  function isPlainObject(v) {
    return v instanceof Object &&
           !(v instanceof Array) &&
           !(v instanceof Function);
  }

  // Flattening an array of array
  function flatten(a) {
    var m = [];
    return m.concat.apply(m, a);
  }

  // Some function
  function some(a, fn) {
    for (var i = 0, l = a.length; i < l; i++) {
      if (fn(a[i]))
        return true;
    }
    return false;
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

  // Checking whether a variable is a jQuery selector
  function isSelector(v) {
    return (artoo.$ && v instanceof artoo.$) ||
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

  // Lazily perform asynchronous task if condition if not true
  function lazy(cond, falseFn, nextFn) {
    if (cond)
      nextFn();
    else
      falseFn(nextFn);
  }

  var imageMimes = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif'
  };

  // Get an image native size
  function getImgNativeSize($image) {
    var image = new Image();
    image.src = $image.attr('src');

    return {
      width: image.width,
      height: image.height
    };
  }

  // Convert an image into a dataUrl
  function imgToDataUrl(img) {
    var $img = enforceSelector(img);

    // Do we know the mime type of the image?
    var mime = imageMimes[$img.attr('src').split('.').slice(-1)[0]] ||
      'image/png';

    // Creating dummy canvas
    var canvas = document.createElement('canvas'),
        size = getImgNativeSize($img);

    canvas.width = size.width;
    canvas.height = size.height;

    // Copy the desired image to a canvas
    var ctx = canvas.getContext('2d');
    ctx.drawImage($img[0], 0, 0);
    var dataUrl = canvas.toDataURL(mime);

    // Clean up
    canvas = null;

    // Returning the url
    return dataUrl;
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

  // Exporting to artoo root
  artoo.injectScript = getScript;
  artoo.waitFor = waitFor;
  artoo.getGlobalVariables = getGlobalVariables;

  // Exporting to artoo helpers
  artoo.helpers = {
    extend: extend,
    enforceSelector: enforceSelector,
    first: first,
    flatten: flatten,
    imgToDataUrl: imgToDataUrl,
    isArray: isArray,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isSelector: isSelector,
    lazy: lazy,
    noop: noop,
    toCSVString: toCSVString,
    some: some
  };
}).call(this);
