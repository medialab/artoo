;(function() {
  'use strict';


  /**
   * The emitter's constructor. It initializes the handlers-per-events store and
   * the global handlers store.
   *
   * Emitters are useful for non-DOM events communication. Read its methods
   * documentation for more information about how it works.
   *
   * @return {Emitter} The fresh new instance.
   */
  var Emitter = function() {
    this._handlers = {};
    this._handlersAll = [];
  };


  /**
   * This method binds one or more functions to the emitter, handled to one or a
   * suite of events. So, these functions will be executed anytime one related
   * event is emitted.
   *
   * It is also possible to bind a function to any emitted event by not specifying
   * any event to bind the function to.
   *
   * Variant 1:
   * **********
   * > myEmitter.on('myEvent', function(e) { console.log(e); });
   *
   * @param  {string}   event   The event to listen to.
   * @param  {function} handler The function to bind.
   * @return {Emitter}          Returns this.
   *
   * Variant 2:
   * **********
   * > myEmitter.on(['myEvent1', 'myEvent2'], function(e) { console.log(e); });
   *
   * @param  {array}    events  The events to listen to.
   * @param  {function} handler The function to bind.
   * @return {Emitter}          Returns this.
   *
   * Variant 3:
   * **********
   * > myEmitter.on({
   * >   myEvent1: function(e) { console.log(e); },
   * >   myEvent2: function(e) { console.log(e); }
   * > });
   *
   * @param  {object} bindings An object containing pairs event / function.
   * @return {Emitter}         Returns this.
   *
   * Variant 4:
   * **********
   * > myEmitter.on(function(e) { console.log(e); });
   *
   * @param  {function} handler The function to bind to every events.
   * @return {Emitter}          Returns this.
   */
  Emitter.prototype.on = function(events, handler, onlyOnce) {
    var i,
        l,
        event,
        eArray,
        last = arguments[arguments.length - 1];

    // Dealing with once polymorphism
    // NOTE: this is hardly clean
    if (typeof last === 'boolean') {
      onlyOnce = last;
      arguments.length--;
    }
    else {
      onlyOnce = false;
    }

    if (
      arguments.length === 1 &&
      typeof arguments[0] === 'object'
    )
      for (event in arguments[0])
        Emitter.prototype.on.call(this, event, arguments[0][event], onlyOnce);

    else if (
      arguments.length === 1 &&
      typeof arguments[0] === 'function'
    )
      this._handlersAll.push({
        handler: arguments[0]
      });

    else if (
      arguments.length === 2 &&
      typeof arguments[1] === 'function'
    ) {
      eArray = typeof events === 'string' ?
        [events] :
        events;

      for (i = 0, l = eArray.length; i !== l; i += 1) {
        event = eArray[i];

        // Check that event is not '':
        if (!event)
          continue;

        if (!this._handlers[event])
          this._handlers[event] = [];

        // Using an object instead of directly the handler will make possible
        // later to add flags
        this._handlers[event].push({
          once: !!onlyOnce,
          handler: handler
        });
      }

    } else
      throw new Error('Wrong arguments.');

    return this;
  };


  /**
   * This method is basically the same as `on` but comes with a notable
   * difference: the handler will fire only once, the first time a relevant
   * event is emitted and will be removed immediately after.
   *
   * Variant 1:
   * **********
   * > myEmitter.once('myEvent', function(e) { console.log(e); });
   *
   * @param  {string}   event   The event to listen to.
   * @param  {function} handler The function to bind.
   * @return {Emitter}          Returns this.
   *
   * Variant 2:
   * **********
   * > myEmitter.once(['myEvent1', 'myEvent2'], function(e) { console.log(e); });
   *
   * @param  {array}    events  The events to listen to.
   * @param  {function} handler The function to bind.
   * @return {Emitter}          Returns this.
   *
   * Variant 3:
   * **********
   * > myEmitter.once({
   * >   myEvent1: function(e) { console.log(e); },
   * >   myEvent2: function(e) { console.log(e); }
   * > });
   *
   * @param  {object} bindings An object containing pairs event / function.
   * @return {Emitter}         Returns this.
   *
   * Variant 4:
   * **********
   * > myEmitter.once(function(e) { console.log(e); });
   *
   * @param  {function} handler The function to bind to every events.
   * @return {Emitter}          Returns this.
   */
  Emitter.prototype.once = function() {
    var args = Array.prototype.slice.call(arguments).concat(true);
    return this.on.apply(this, args);
  };


  /**
   * This method unbinds one or more functions from events of the emitter. So,
   * these functions will no more be executed when the related events are emitted.
   * If the functions were not bound to the events, nothing will happen, and no
   * error will be thrown.
   *
   * It is also possible to unbind a function from every AND any emitted event by
   * not specifying any event to bind the function to.
   *
   * Variant 1:
   * **********
   * > myEmitter.off('myEvent');
   *
   * @param  {string} event The event to unbind.
   * @return {Emitter}      Returns this.
   *
   * Variant 1:
   * **********
   * > myEmitter.off(['myEvent1', 'myEvent2']);
   *
   * @param  {array} events The events to unbind.
   * @return {Emitter}      Returns this.
   *
   * Variant 2:
   * **********
   * > myEmitter.off(['myEvent1', 'myEvent2'], myHandler);
   *
   * @param  {array}    events  The events to unbind to.
   * @param  {function} handler The function to unbind.
   * @return {Emitter}          Returns this.
   *
   * Variant 3:
   * **********
   * > myEmitter.off({
   * >   myEvent1: myHandler1,
   * >   myEvent2: myHandler2
   * > });
   *
   * @param  {object} bindings An object containing pairs event / function.
   * @return {Emitter}         Returns this.
   *
   * Variant 4:
   * **********
   * > myEmitter.off(myHandler);
   *
   * @param  {function} handler The function to unbind to every events.
   * @return {Emitter}          Returns this.
   */
  Emitter.prototype.off = function(events, handler, onlyOnce) {
    var i,
        n,
        j,
        m,
        k,
        a,
        event,
        last = arguments[arguments.length - 1],
        eArray = typeof events === 'string' ?
          [events] :
          events;

    // Dealing with once polymorphism
    // NOTE: this is hardly clean
    if (typeof last === 'boolean') {
      onlyOnce = last;
      arguments.length--;
    }
    else {
      onlyOnce = false;
    }

    if (!arguments.length) {
      this._handlersAll = [];
      for (k in this._handlers)
        delete this._handlers[k];
    }

    else if (arguments.length === 1 && typeof eArray !== 'function')
      for (i = 0, n = eArray.length; i !== n; i += 1)
        delete this._handlers[eArray[i]];

    else if (arguments.length === 1 && typeof eArray === 'function') {
      handler = arguments[0];

      // Handlers bound to events:
      for (k in this._handlers) {
        a = [];
        for (i = 0, n = this._handlers[k].length; i !== n; i += 1)
          if (this._handlers[k][i].handler !== handler)
            a.push(this._handlers[k][i]);
        this._handlers[k] = a;
      }

      a = [];
      for (i = 0, n = this._handlersAll.length; i !== n; i += 1)
        if (this._handlersAll[i].handler !== handler)
          a.push(this._handlersAll[i]);
      this._handlersAll = a;
    }

    else if (arguments.length === 2) {
      for (i = 0, n = eArray.length; i !== n; i += 1) {
        event = eArray[i];
        if (this._handlers[event]) {
          a = [];
          for (j = 0, m = this._handlers[event].length; j !== m; j += 1) {
            if (this._handlers[event][j].handler !== handler ||
                (onlyOnce && !this._handlers[event][j].once))
              a.push(this._handlers[event][j]);
          }

          this._handlers[event] = a;
        }

        if (this._handlers[event] && this._handlers[event].length === 0)
          delete this._handlers[event];
      }
    }

    return this;
  };


  /**
   * This method emits the specified event(s), and executes every handlers bound
   * to the event(s).
   *
   * Use cases:
   * **********
   * > myEmitter.emit('myEvent');
   * > myEmitter.emit('myEvent', myData);
   * > myEmitter.emit(['myEvent1', 'myEvent2']);
   * > myEmitter.emit(['myEvent1', 'myEvent2'], myData);
   *
   * @param  {string|array} events The event(s) to emit.
   * @param  {object?}      data   The data.
   * @return {Emitter}             Returns this.
   */
  Emitter.prototype.emit = function(events, data) {
    var i,
        n,
        j,
        m,
        event,
        handlers,
        eventName,
        self = this,
        eArray = typeof events === 'string' ?
          [events] :
          events;

    data = data === undefined ? {} : data;

    for (i = 0, n = eArray.length; i !== n; i += 1) {
      eventName = eArray[i];
      handlers = (this._handlers[eventName] || []).concat(this._handlersAll);

      if (handlers.length) {
        event = {
          type: eventName,
          data: data || {},
          target: this
        };

        for (j = 0, m = handlers.length; j !== m; j += 1) {
          handlers[j].handler.call(this, event);

          // Removing handler if once
          if (handlers[j].once)
            this.off(eventName, handlers[j].handler, true);
        }
      }
    }

    return this;
  };


  /**
   * This method will create a binder, to help enable / disable a bunch of
   * functions as a single entity. This binder extends the on / off API of the
   * emitter.
   *
   * @param  {object} bindings The initial bindings.
   * @return {Binder}          The binder.
   */
  Emitter.prototype.binder = function() {
    var k,
        i,
        l,
        a,
        binder = new Binder(this);

    // Bind initial bindings:
    if (arguments.length)
      binder.on.apply(binder, arguments);

    return binder;
  };






  /**
   * The binder's constructor. Binders are useful if you want to manage your
   * bindings as batches instead of individually.
   *
   * @return {Emitter} The fresh new instance.
   */
  var Binder = function(emitter) {
    // Initialize the emitter
    Emitter.call(this);

    // Reference the parent emitter:
    this._emitter = emitter;

    // Add current state:
    this._enabled = true;
  };


  /**
   * This method registers the pairs event(s) / function in the binder, and
   * binds them to the emitter if the binder is activated.
   *
   * The polymorphism is exactly the one from Emitter.prototype.on.
   */
  Binder.prototype.on = function() {
    // Store the bindings as if it were an emitter:
    Emitter.prototype.on.apply(this, arguments);

    // Actually send the bindings to the parent emitter if the binder is on:
    if (this._enabled)
      this._emitter.on.apply(this._emitter, arguments);

    return this;
  };


  /**
   * This method registers the pairs event(s) / function in the binder, and
   * binds them to the emitter if the binder is activated.
   *
   * The only difference with Binder.prototype.on is that the handler will
   * only be fired the first time the relevant event is emitted.
   *
   * The polymorphism is exactly the one from Emitter.prototype.on.
   */
  Binder.prototype.once = function() {
    var args = Array.prototype.slice.call(arguments).concat(true);

    // Store the bindings as if it were an emitter:
    Emitter.prototype.on.apply(this, args);

    // Actually send the bindings to the parent emitter if the binder is on:
    if (this._enabled)
      this._emitter.on.apply(this._emitter, args);

    return this;
  };


  /**
   * This method unregister the pairs event(s) / function from the binder, and
   * unbinds them from the emitter if the binder is activated.
   *
   * The polymorphism is exactly the one from Emitter.prototype.off.
   */
  Binder.prototype.off = function() {
    // Store the bindings as if it were an emitter:
    Emitter.prototype.off.apply(this, arguments);

    // Actually send the bindings to the parent emitter if the binder is on:
    if (this._enabled)
      this._emitter.off.apply(this._emitter, arguments);

    return this;
  };


  /**
   * If the binder if not enabled yet, this method will enable it and bind each
   * stored event(s) / function pair to the emitter.
   *
   * @return {Binder} Returns this.
   */
  Binder.prototype.enable = function() {
    var k,
        a,
        i,
        l;

    if (this._enabled)
      return this;

    this._enabled = true;

    // First, let's deal with the _handlersAll index:
    a = this._handlersAll;
    for (i = a.length - 1; i >= 0; i--)
      this._emitter.on(a[i].handler);

    // Let's now deal with the _handlers index:
    for (k in this._handlers) {
      a = this._handlers[k];
      for (i = a.length - 1; i >= 0; i--)
        this._emitter.on(k, a[i].handler);
    }

    return this;
  };


  /**
   * If the binder if enabled, this method will disable it and unbind each stored
   * event(s) / function pair from the emitter.
   *
   * @return {Binder} Returns this.
   */
  Binder.prototype.disable = function() {
    var i,
        k,
        a;

    if (!this._enabled)
      return this;

    // First, let's deal with the _handlersAll index:
    // NOTE: Since the Emitter API does not allow to unbind functions ONLY from
    // the _handlersAll index, I had to do it manually here.
    function checkHandler(obj) {
      return obj.handler === a[i].handler;
    }
    a = this._emitter._handlersAll;
    for (i = a.length - 1; i >= 0; i--)
      /*jslint browser: true, plusplus: true */
      if (this._handlersAll.find(checkHandler))
        a.splice(i, 1);

    // Let's now deal with the _handlers index:
    for (k in this._handlers) {
      a = this._handlers[k];
      for (i = a.length - 1; i >= 0; i--)
        this._emitter.off(k, a[i].handler);
    }

    this._enabled = false;

    return this;
  };


  /**
   * Version:
   */
  Emitter.version = '1.0.0';


  // Export:
  artoo.emitter = Emitter;
}).call(this);
