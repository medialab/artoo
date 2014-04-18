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

  // Properties
  var defaultFilename = 'data',
      defaultEncoding = 'utf-8',
      defaultMime = 'application/octet-stream',
      xmlns = 'http://www.w3.org/1999/xhtml',
      deletionQueue = [],
      mimeShortcuts = {
        csv: 'text/csv',
        json: 'application/json'
      };

  var reqfs = window.requestFileSystem ||
              window.webkitRequestFileSystem ||
              window.mozRequestFileSystem;

  var URL = _root.URL || _root.webkitURL || _root;

  // Saver Abstraction
  function Saver(blob, filename) {
    var _this = this,
        minSize = blob.size,
        saveLink = document.createElementNS(xmlns, 'a'),
        canUseSaveLink = !_root.externalHost && 'download' in saveLink;

    // State
    this.WRITING = 1;
    this.DONE = 2;

    // First method
    console.log(canUseSaveLink);
    if (canUseSaveLink) {
      var oURL = blobURL(blob);

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
  }

  // Blob creation
  function createBlob(data, mime, encoding) {
    mime = mimeShortcuts[mime] || mime || defaultMime;
    return new Blob(
      [data],
      {type: mime + ';charset=' + encoding || defaultEncoding}
    );
  }

  // Url from blob
  function blobURL(blob) {
    var oURL = URL.createObjectURL(blob);
    deletionQueue.push(oURL);
    return oURL;
  }

  // Main interface
  function save(data, params) {

  }

  // Exporting
  artoo.save = function(data, filename, type) {

  };

  artoo.saveJson = function(data, filename) {
    // stringify
  };

  artoo.saveCsv = function(data, filename) {
    // stringify if array of array and !== string
  };

  artoo.test = function(data) {
    new Saver(createBlob(JSON.stringify(data), 'json'), 'test.json');
  };
}).call(this);
