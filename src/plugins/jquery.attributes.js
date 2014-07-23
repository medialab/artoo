;(function(undefined) {
  'use strict';

  /**
   * artoo attributes jQuery plugin
   * ===============================
   *
   * Simplistic jQuery plugin designed to retrieve list of attributes for the
   * given elements.
   */

  // TODO: filter empty class
  function _classes($) {
    $.fn.classes = function() {
      var index = {},
          cls;

      $(this).each(function() {
        cls = ($(this).attr('class') || '').trim().replace(/\s+/g, ' ');
        if (cls)
          cls.split(' ').forEach(function(c) {
            index[c] = true;
          });
      });

      return Object.keys(index);
    };
  }

  function _attributes($) {
    $.fn.attributes = function(blackList) {
      blackList = blackList || [];

      var $e = $(this).first(),
          attrs = {},
          i,
          l,
          a,
          n,
          v;

      if (!$e[0])
        throw Error('jquery.attributes: trying to access attributes ' +
                    'of no element.');

      for (i = 0, l = $e[0].attributes.length; i < l; i++) {
        a = $e[0].attributes[i];
        n = a.name || a.nodeName;

        if (~blackList.indexOf(n))
          continue;

        v = $e.attr(n);

        if (v !== undefined && v !== false)
          attrs[n] = v;
      }

      return attrs;
    };
  }

  // Exporting
  artoo.jquery.plugins.push(_classes);
  artoo.jquery.plugins.push(_attributes);
}).call(this);
