;(function(undefined) {

  /**
   * Some unit tests helpers
   * ========================
   *
   */

  // Selectors
  var $doms = $('#artoo-doms');

  // Generic helpers
  this.helpers = {

    // Returns some html and append it to an invible DOM node for testing
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

  // Mockup asynchronous data store
  this.MockupAsynchronousStore = function() {
    var self = this;

    // Properties
    this.index = 0;
    this.store = {};
    this.calls = {};

    // Methods
    this._send = function(header, data) {
      window.postMessage({
        id: ++this.index,
        header: header,
        body: data
      }, '*');
    };

    this.send = function(action, params) {
      var promise = $.Deferred();

      // Sending message
      self._send('store', {action: action, params: params});

      // Registering call
      self.calls[self.index] = promise;

      return promise;
    };

    // Receptors
    window.addEventListener('message', function(e) {
      var body = e.data.body;

      // Acting
      switch (body.action) {
        case 'set':
          self.store[body.params.key] = body.params.value;
          self.calls[e.data.id].resolve();
          break;
        case 'get':
          self.calls[e.data.id].resolve(
            self.store[body.params.key]);
          break;
        case 'getAll':
          self.calls[e.data.id].resolve(
            self.store);
          break;
        case 'keys':
          self.calls[e.data.id].resolve(Object.keys(self.store));
          break;
        case 'remove':
          delete self.store[body.params.key];
          self.calls[e.data.id].resolve();
          break;
        case 'removeAll':
          self.store = {};
          self.calls[e.data.id].resolve();
          break;
        default:
          throw Error('mockup: wrong action: "' + body.action + '".');
      }

      // Cleaning call
      delete self.calls[e.data.id];
    }, false);
  };
}).call(this);
