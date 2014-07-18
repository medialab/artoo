;(function(undefined) {
  'use strict';

  /**
   * artoo db methods
   * =================
   *
   * IndexedDB abstraction.
   */
  var _root = this;

  // Checking presence of indexedDB
  if (!('indexedDB' in _root))
    return;

  // Database abstraction
  function Database() {
    var self = this;

    // Properties
    this.opened = false;
    this.db = null;
    this.collections = {};

    this.open = function() {
      var openRequest = indexedDB.open('artoo'),
          promise = artoo.$.Deferred();

      if (this.opened) {
        promise.resolve(this.db);
      }
      else {

        // Callbacks
        openRequest.onsuccess = function(e) {
          self.opened = true;
          self.db = e.target.result;
          promise.resolve(self.db);
        };

        openRequest.onerror = function(e) {
          promise.reject(e.target.error);
        };
      }

      return promise;
    };

    this.objectStore = function(name, params) {
      params = params || {keyPath: 'id', autoIncrement: true};

      var promise = artoo.$.Deferred();

      function createAndResolve() {
        self.collections[name] = new Collection(name, params, self.db);
        promise.resolve(self.collections[name]);
      }

      this.open().then(function() {
        if (name in self.collections) {
          promise.resolve(self.collections[name]);
        }
        else {

          if (self.db.objectStoreNames.contains(name)) {

            // The collection already exist, we return it
            createAndResolve();
          }
          else {

            // The collection is inexistent, we create it
            self.db.close();
            var upgradeRequest = indexedDB.open('artoo', self.db.version + 1);

            upgradeRequest.onupgradeneeded = function(e) {

              // Adding an objectStore
              e.target.result.createObjectStore(name, params);
            };

            upgradeRequest.onsuccess = function(e) {

              // Updating db
              self.db = e.target.result;

              // Resolving
              createAndResolve();
            };

            upgradeRequest.onerror = function(e) {
              promise.reject(e.target.error);
            };

            upgradeRequest.onblocked = function(e) {
              promise.reject('blocked');
            };
          }
        }
      });

      return promise;
    };
  }

  // Collection abstraction
  // TODO: key-value collection just in case (for the time being, restrain)
  function Collection(name, params, db) {

    // Properties
    this.name = name;
    this.params = params;

    // Methods
    this.transaction = function(mode) {
      mode = mode || 'readonly';

      return db.transaction([this.name], mode);
    };

    this.add = function(data, cb) {
      var request = this.transaction('readwrite')
                        .objectStore(this.name)
                        .add(data);

      // Request callbacks
      request.onsuccess = function(e) {
        if (typeof cb === 'function')
          cb(null, e.target.result);
      };

      request.onerror = function(e) {
        if (typeof cb === 'function')
          cb(e.target.error);
      };
    };

    this.get = function(key, cb) {
      var request = this.transaction()
                        .objectStore(this.name)
                        .get(key);

      // Request callbacks
      request.onsuccess = function(e) {
        if (typeof cb === 'function')
          cb(null, e.target.result || null);
      };

      request.onerror = function(e) {
        cb(e.target.error);
      };
    };
  }

  var DB = new Database();

  // Namespacing
  artoo.db = function(collection, params, cb) {
    return artoo.db.open(collection, params, cb);
  };

  // Exporting methods
  artoo.db.open = function(collection, params, cb) {
    if (typeof params === 'function')
      cb = params;
      params = null;

    DB.objectStore(collection, params).then(cb);
  };
}).call(this);
