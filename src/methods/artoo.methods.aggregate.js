;(function(undefined) {
  'use strict';

  /**
   * artoo aggregate methods
   * ========================
   *
   * Aggregation method. Return array of data corresponding to a precise
   * jQuery selector.
   */
  var _root = this;

  artoo.aggregate = function($sel, method) {
    method = method || 'html';

    var a = [];
    artoo.helpers.enforceSelector($sel).each(function() {
      a.push($(this)[method]());
    });

    return a;
  };
}).call(this);
