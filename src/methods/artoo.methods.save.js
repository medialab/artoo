;(function(undefined) {
  'use strict';

  /**
   * artoo save methods
   * ===================
   *
   * Some helpers to save data to a file that will be downloaded by the
   * browser. Works mainly with chrome for the time being.
   *
   * Mainly inspired by:
   * https://github.com/eligrey/FileSaver.js/blob/master/FileSaver.js
   */
  var _root = this;

  // Polyfills
  var reqfs = window.requestFileSystem ||
              window.webkitRequestFileSystem ||
              window.mozRequestFileSystem;

  var URL = _root.URL || _root.webkitURL || _root;

  // Main abstraction
  function Saver() {
    var _saver;

    // Properties
    this.defaultFilename = 'artoo_data';
    this.defaultEncoding = 'utf-8';
    this.forceDownloadMimeType = 'application/octet-stream';
    this.defaultMimeType = 'text/plain';
    this.xmlns = 'http://www.w3.org/1999/xhtml';
    this.deletionQueue = [];
    this.mimeShortcuts = {
      csv: 'text/csv',
      json: 'application/json',
      txt: 'text/plain',
      html: 'text/html'
    };

    // State
    this.INIT = 0;
    this.WRITING = 1;
    this.DONE = 2;

    // Methods
    this.createBlob = function(data, mime, encoding) {
      mime = this.mimeShortcuts[mime] || mime || this.defaultMime;
      return new Blob(
        [data],
        {type: mime + ';charset=' + encoding || this.defaultEncoding}
      );
    };

    this.blobURL = function(blob) {
      var oURL = URL.createObjectURL(blob);
      this.deletionQueue.push(oURL);
      return oURL;
    };

    this.saveBlob = function(blob, filename) {
      this.readyState = this.INIT;

      var minSize = blob.size,
          saveLink = document.createElementNS(this.xmlns, 'a'),
          canUseSaveLink = !_root.externalHost && 'download' in saveLink;

      if (canUseSaveLink) {
        var oURL = this.blobURL(blob);

        // Updating the save link
        saveLink.href = oURL;
        saveLink.download = filename;

        // Creating event
        var e = document.createEvent('MouseEvents');
        e.initMouseEvent(
          'click', true, false, _root, 0, 0, 0, 0, 0,
          false, false, false, false, 0, null);

        saveLink.dispatchEvent(e);
        this.readyState = this.DONE;
        // dispatch_all
      }
    };

    // Main interface
    this.save = function(data, params) {
      params = params || {};

      // Creating the blob
      var blob = this.createBlob(data, params.mime, params.encoding);

      // Saving the blob
      this.saveBlob(blob, params.filename || this.defaultFilename);
    };
  }

  var _saver = new Saver();

  // Exporting
  Artoo.prototype.save = function(data, params) {
    params = params || {};

    _saver.save(
      data,
      params
    );
  };

  Artoo.prototype.saveJson = function(data, params) {
    params = params || {};

    // Enforcing json
    if (typeof data !== 'string') {
      if (params.pretty || params.indent)
        data = JSON.stringify(data, undefined, params.indent || 2);
      else
        data = JSON.stringify(data);
    }
    else {
      if (params.pretty || params.indent)
        data = JSON.stringify(JSON.parse(data), undefined, params.indent || 2);
    }

    // Extending params
    params.filename = params.filename || 'data.json';
    params.mime = 'json';

    this.save(
      data,
      params
    );
  };

  Artoo.prototype.savePrettyJson = function(data, params) {
    params = params || {};
    params.pretty = true;
    this.saveJson(data, params);
  };

  Artoo.prototype.saveCsv = function(data, params) {
    params = params || {};

    if (typeof data !== 'string') {

      // We convert the array of arrays to a csv string
    }
  };

  Artoo.prototype.saveHtml = function(data, params) {
    // check typeof domelement or jquery sel? or string
  };

  Artoo.prototype.savePageHtml = function(params) {
    params = params || {};
    params.mime = 'html';

    this.save(
      document.documentElement.innerHTML,
      params
    );
  };
}).call(this);
