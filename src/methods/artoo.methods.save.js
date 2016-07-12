;(function(undefined) {
  'use strict';

  /**
   * artoo save methods
   * ===================
   *
   * Some helpers to save data to a file that will be downloaded by the
   * browser. Works mainly with chrome for the time being.
   *
   */
  var _root = this,
      helpers = artoo.helpers;

  // Polyfills
  var URL = _root.URL || _root.webkitURL || _root;

  // Utilities
  function selectorOuterHTML($sel) {
    return ($sel[0].documentElement && $sel[0].documentElement.outerHTML) ||
           $sel[0].outerHTML;
  }

  function filenamePolymorphism(params) {
    return (typeof params === 'string') ? {filename: params} : params || {};
  }

  // Main abstraction
  function Saver() {
    var _saver;

    // Properties
    this.defaultFilename = 'artoo_data';
    this.defaultEncoding = 'utf-8';
    this.xmlns = 'http://www.w3.org/1999/xhtml';
    this.mimeShortcuts = {
      csv: 'text/csv',
      tsv: 'text/tab-separated-values',
      json: 'application/json',
      txt: 'text/plain',
      html: 'text/html',
      yaml: 'text/yaml'
    };

    // Methods
    this.createBlob = function(data, mime, encoding) {
      mime = this.mimeShortcuts[mime] || mime || this.defaultMime;
      return new Blob(
        [data],
        {type: mime + ';charset=' + encoding || this.defaultEncoding}
      );
    };

    this.createBlobFromDataURL = function(url) {
      var byteString = atob(url.split(',')[1]),
          ba = new Uint8Array(byteString.length),
          i,
          l;

      for (i = 0, l = byteString.length; i < l; i++)
        ba[i] = byteString.charCodeAt(i);

      return new Blob([ba.buffer], {
        type: url.split(',')[0].split(':')[1].split(';')[0]
      });
    };

    this.blobURL = function(blob) {
      var oURL = URL.createObjectURL(blob);
      return oURL;
    };

    this.saveResource = function(href, params) {
      var a = document.createElementNS(this.xmlns, 'a');
      a.href = href;

      a.setAttribute('download', params.filename || '');

      // Firefox needs the link attached to the page's DOM
      if ('document' in _root)
        document.body.appendChild(a);

      a.click();

      if ('document' in _root)
        document.body.removeChild(a);
      a = null;

      // Revoking the object URL if we want to
      if (params.revoke)
        setTimeout(function() {
          URL.revokeObjectURL(href);
        });
    };

    // Main interface
    this.saveData = function(data, params) {
      params = params || {};

      // Creating the blob
      var blob = this.createBlob(data, params.mime, params.encoding);

      // Saving the blob
      this.saveResource(
        this.blobURL(blob),
        {
          filename: params.filename || this.defaultFilename,
          revoke: params.revoke || true
        }
      );
    };

    this.saveDataURL = function(url, params) {
      params = params || {};

      // Creating the blob
      var blob = this.createBlobFromDataURL(url);

      // Saving the blob
      this.saveResource(
        blob,
        {filename: params.filename || this.defaultFilename}
      );
    };
  }

  var _saver = new Saver();

  // Exporting
  artoo.save = function(data, params) {
    _saver.saveData(data, filenamePolymorphism(params));
  };

  artoo.saveJson = function(data, params) {
    params = filenamePolymorphism(params);

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
    artoo.save(
      data,
      helpers.extend(params, {filename: 'data.json', mime: 'json'})
    );
  };

  artoo.savePrettyJson = function(data, params) {
    params = filenamePolymorphism(params);
    artoo.saveJson(data, helpers.extend(params, {pretty: true}));
  };

  artoo.saveYaml = function(data, params) {
    params = filenamePolymorphism(params);
    artoo.save(
      artoo.writers.yaml(data),
      helpers.extend(params, {filename: 'data.yml', mime: 'yaml'})
    );
  };

  artoo.saveCsv = function(data, params) {
    params = filenamePolymorphism(params);

    data = (typeof data !== 'string') ?
      artoo.writers.csv(data, params) :
      data;

    artoo.save(
      data,
      helpers.extend(params, {mime: 'csv', filename: 'data.csv'})
    );
  };

  artoo.saveTsv = function(data, params) {
    artoo.saveCsv(
      data,
      helpers.extend(filenamePolymorphism(params), {
        mime: 'tsv',
        delimiter: '\t',
        filename: 'data.tsv'
      })
    );
  };

  artoo.saveXml = function(data, params) {
    params = filenamePolymorphism(params);

    var s = (helpers.isSelector(data) && selectorOuterHTML(data)) ||
            (helpers.isDocument(data) && data.documentElement.outerHTML) ||
            data,
        type = params.type || 'xml',
        header = '';

    // Determining doctype
    if (type === 'html' && helpers.isDocument(data)) {
      var dt = data.doctype;

      if (dt)
        header = '<!DOCTYPE ' + (dt.name || 'html') +
                 (dt.publicId ? ' PUBLIC "' + dt.publicId + '"' : '') +
                 (dt.systemId ? ' "' + dt.systemId + '"' : '') + '>\n';
    }
    else if (type === 'xml' || type === 'svg') {
      if (!~s.search(/<\?xml/))
        header = '<?xml version="1.0" encoding="' +
                 (params.encoding || 'utf-8') +
                 '" standalone="yes"?>\n';
    }

    if (type === 'svg') {
      header += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ' +
                '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n';
    }

    artoo.save(
      header + s,
      helpers.extend(
        params,
        {mime: 'html', filename: 'document.xml'})
    );
  };

  artoo.saveHtml = function(data, params) {
    artoo.saveXml(
      data,
      helpers.extend(
        filenamePolymorphism(params),
        {filename: 'document.html', type: 'html'}
      )
    );
  };

  artoo.savePageHtml = function(params) {
    artoo.saveHtml(
      document,
      helpers.extend(filenamePolymorphism(params), {filename: 'page.html'})
    );
  };

  artoo.saveSvg = function(sel, params) {
    params = filenamePolymorphism(params);

    var $sel = artoo.$(sel);
    if (!$sel.is('svg'))
      throw Error('artoo.saveSvg: selector is not svg.');

    artoo.saveXml(
      $sel,
      helpers.extend(params, {filename: 'drawing.svg', type: 'svg'})
    );
  };

  artoo.saveStore = function(params) {
    params = filenamePolymorphism(params);
    artoo.savePrettyJson(
      artoo.store.get(params.key),
      helpers.extend(params, {filename: 'store.json'})
    );
  };

  artoo.saveResource = function(url, params) {
    _saver.saveResource(url, filenamePolymorphism(params));
  };

  artoo.saveImage = function(sel, params) {
    params = filenamePolymorphism(params);

    var $sel = artoo.$(sel);

    if (!$sel.is('img') && !$sel.attr('src'))
      throw Error('artoo.saveImage: selector is not an image.');

    var ext = helpers.getExtension($sel.attr('src')),
        alt = $sel.attr('alt');

    artoo.saveResource(
      $sel.attr('src'),
      helpers.extend(
        params,
        {
          filename: alt ? alt + (ext ? '.' + ext : '') : false
        }
      )
    );
  };
}).call(this);
