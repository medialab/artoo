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

  // Waiting for something to happen
  function waitFor(check, cb, milliseconds) {
    var i = setInterval(function() {
      if (check()) {
        cb();
        clearInterval(i);
      }
    }, milliseconds || 30);
  }

  // Exporting to artoo root
  artoo.injectScript = getScript;
  artoo.waitFor = waitFor;

  // Exporting to artoo helpers
  artoo.helpers = {
    extend: extend,
    enforceSelector: enforceSelector,
    toCSVString: toCSVString
  };
}).call(this);
