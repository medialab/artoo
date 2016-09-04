;(function(undefined) {
  'use strict';

  /**
   * artoo ajax sniffer
   * ===================
   *
   * A useful ajax request sniffer.
   */
  var _root = this,
      before = artoo.helpers.before;

  // Persistent state
  var originalXhr = {
    open: XMLHttpRequest.prototype.open,
    send: XMLHttpRequest.prototype.send,
    setRequestHeader: XMLHttpRequest.prototype.setRequestHeader
  };

  // Main abstraction
  // TODO: working criteria
  // TODO: fire exception one step above
  function AjaxSniffer() {
    var self = this;

    // Properties
    this.hooked = false;
    this.listeners = [];

    // Privates
    function hook() {
      if (self.hooked)
        return;

      // Monkey patching the 'open' method
      XMLHttpRequest.prototype.open = before(
        XMLHttpRequest.prototype.open,
        function(method, url, async) {
          var xhr = this;

          // Overloading the xhr object
          xhr._spy = {
            method: method,
            url: url,
            params: artoo.parsers.url(url).query
          };
        }
      );

      // Monkey patching the 'send' method
      XMLHttpRequest.prototype.send = before(
        XMLHttpRequest.prototype.send,
        function(data) {
          var xhr = this;

          // Overloading the xhr object
          if (data) {
            xhr._spy.querystring = data;
            xhr._spy.data = artoo.parsers.queryString(data);
          }

          // Triggering listeners
          self.listeners.forEach(function(listener) {
            if (listener.criteria === '*')
              listener.fn.call(xhr, xhr._spy);
          });
        }
      );

      self.hooked = true;
    }

    function release() {
      if (!self.hooked)
        return;

      XMLHttpRequest.prototype.send = originalXhr.send;
      XMLHttpRequest.prototype.open = originalXhr.open;

      self.hooked = false;
    }

    // Methods
    this.before = function(criteria, callback) {

      // Polymorphism
      if (typeof criteria === 'function') {
        callback = criteria;
        criteria = null;
      }

      criteria = criteria || {};

      // Hooking xhr
      hook();

      // Binding listener
      this.listeners.push({criteria: '*', fn: callback});
    };

    this.after = function(criteria, callback) {

      // Polymorphism
      if (typeof criteria === 'function') {
        callback = criteria;
        criteria = null;
      }

      criteria = criteria || {};

      // Hooking xhr
      hook();

      // Binding a deviant listener
      this.listeners.push({criteria: '*', fn: function() {
        var xhr = this,
            originalCallback = xhr.onreadystatechange;

        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.prototype.DONE) {

            // Retrieving data as per response headers
            var contentType = xhr.getResponseHeader('Content-Type'),
                data = xhr.response;

            if (contentType && ~contentType.search(/json/)) {
              try {
                data = JSON.parse(xhr.responseText);
              }
              catch (e) {
                // pass...
              }
            }
            else if (contentType && ~contentType.search(/xml/)) {
              data = xhr.responseXML;
            } else {
              try {
                data = JSON.parse(xhr.responseText);
              } catch (e) {
                data = xhr.responseText;
              }
            }

            callback.call(xhr, xhr._spy, {
              data: data,
              headers: artoo.parsers.headers(xhr.getAllResponseHeaders())
            });
          }

          if (typeof originalCallback === 'function')
            originalCallback.apply(xhr, arguments);
        };
      }});
    };

    this.off = function(fn) {

      // Splicing function from listeners
      var index = artoo.helpers.indexOf(this.listeners, function(listener) {
        return listener.fn === fn;
      });

      // Incorrect function
      if (!~index)
        throw Error('artoo.ajaxSniffer.off: trying to remove an inexistant ' +
                    'listener.');

      this.listeners.splice(index, 1);

      // If no listeners were to remain, we release xhr
      if (!this.listeners.length)
        release();
    };
  }

  // Namespace
  artoo.ajaxSniffer = new AjaxSniffer();
}).call(this);
