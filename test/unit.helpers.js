;(function(undefined) {

  /**
   * Some unit tests helpers
   * ========================
   *
   */

  // Selectors
  var $doms = $('#artoo-doms');

  this.helpers = {
    fetchHTMLResource: function(name, cb) {

      // Appending a new dom
      var $newDom = $('<div id="' + name + '"></div>');
      $doms.append($newDom);

      // Loading from resources.
      $newDom.load('resources/' + name + '.html',
        function() {
          cb('#' + name);
        });
    }
  };
}).call(this);
