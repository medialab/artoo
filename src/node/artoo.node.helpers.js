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

  // Is the var an array?
  function isArray(v) {
    return v instanceof Array;
  }

  // Is the var a plain object?
  function isPlainObject(v) {
    return v instanceof Object &&
           !(v instanceof Array) &&
           !(v instanceof Function);
  }

  // False function
  function isDocument(v) {
    return false;
  }

  // Is this a cheerio selector?
  function isSelector(v) {
    return !!v._root;
  }

  // Exporting to artoo helpers
  artoo.helpers = {
    extend: extend,
    isArray: isArray,
    isDocument: isDocument,
    isPlainObject: isPlainObject,
    isSelector: isSelector
  };
}).call(this);
