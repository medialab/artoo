;(function(undefined) {
  'use strict';

  /**
   * artoo helpers
   * ==============
   *
   */
  var root = this;


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

  // Package helper
  function pkg(pkgName) {
    return (pkgName || '').split('.').reduce(function(context, objName) {
      return (objName in context) ?
        context[objName] :
        (context[objName] = {});
    }, _root);
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
        cb();
        script.onload = script.onreadystatechange = null;
        head.removeChild(script);
      }
    };

    // Appending the script to head
    head.appendChild(script);
  }

  // Exporting
  artoo.helpers = {
    extend: extend,
    getScript: getScript,
    pkg: pkg
  };
}).call(this);
