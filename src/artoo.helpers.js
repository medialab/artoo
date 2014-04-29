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
    toCSVString: toCSVString
  };
}).call(this);
