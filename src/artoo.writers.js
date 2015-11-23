;(function(undefined) {
  'use strict';

  /**
   * artoo writers
   * ==============
   *
   * Compilation of writers for popular formats such as CSV or YAML.
   */

  // Dependencies
  var isPlainObject = artoo.helpers.isPlainObject,
      isArray = artoo.helpers.isArray,
      isPrimitive = artoo.helpers.isPrimitive,
      isNonPrimitive = artoo.helpers.isNonPrimitive,
      isRealNaN = artoo.helpers.isRealNaN;


  /**
   * CSV
   * ---
   *
   * Converts an array of array or array of objects into a correct
   * CSV string for exports purposes.
   *
   * Exposes some handful options such as choice of delimiters or order
   * of keys to handle.
   */

  // Convert an object into an array of its properties
  function objectToArray(o, order) {
    order = order || Object.keys(o);

    return order.map(function(k) {
      return o[k];
    });
  }

  // Retrieve an index of keys present in an array of objects
  function keysIndex(a) {
    var keys = [],
        l,
        k,
        i;

    for (i = 0, l = a.length; i < l; i++)
      for (k in a[i])
        if (!~keys.indexOf(k))
          keys.push(k);

    return keys;
  }

  // Escape a string for a RegEx
  function rescape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  // Converting an array of arrays into a CSV string
  function toCSVString(data, params) {
    if (data.length === 0) {
      return '';
    }
    params = params || {};

    var header = params.headers || [],
        plainObject = isPlainObject(data[0]),
        keys = plainObject && (params.order || keysIndex(data)),
        oData,
        i;

    // Defaults
    var escape = params.escape || '"',
        delimiter = params.delimiter || ',';

    // Dealing with headers polymorphism
    if (!header.length)
      if (plainObject && params.headers !== false)
        header = keys;

    // Should we append headers
    oData = (header.length ? [header] : []).concat(
      plainObject ?
        data.map(function(e) { return objectToArray(e, keys); }) :
        data
    );

    // Converting to string
    return oData.map(function(row) {
      return row.map(function(item) {

        // Wrapping escaping characters
        var i = ('' + (typeof item === 'undefined' ? '' : item)).replace(
          new RegExp(rescape(escape), 'g'),
          escape + escape
        );

        // Escaping if needed
        return ~i.indexOf(delimiter) || ~i.indexOf(escape) || ~i.indexOf('\n') ?
          escape + i + escape :
          i;
      }).join(delimiter);
    }).join('\n');
  }



  /**
   * YAML
   * ----
   *
   * Converts JavaScript data into a YAML string for export purposes.
   */

  // Characters to escape in YAML
  var ymlEscape = /[:#,\-\[\]\{\}&%]|!{1,2}/;

  // Creating repeating sequences
  function repeatString(string, nb) {
    var s = string,
        l,
        i;

    if (nb <= 0)
      return '';

    for (i = 1, l = nb | 0; i < l; i++)
      s += string;
    return s;
  }

  // YAML conversion
  var yml = {
    string: function(string) {
      return (~string.search(ymlEscape)) ?
        '\'' + string.replace(/'/g, '\'\'') + '\'' :
        string;
    },
    number: function(nb) {
      return '' + nb;
    },
    array: function(a, lvl) {
      lvl = lvl || 0;

      if (!a.length)
        return '[]';

      var string = '',
          l,
          i;

      for (i = 0, l = a.length; i < l; i++) {
        string += repeatString('  ', lvl);

        if (isPrimitive(a[i])) {
          string += '- ' + processYAMLVariable(a[i]) + '\n';
        }
        else {
          if (isPlainObject(a[i]))
            string += '-' + processYAMLVariable(a[i], lvl + 1, true);
          else
            string += processYAMLVariable(a[i], lvl + 1);
        }
      }

      return string;
    },
    object: function(o, lvl, indent) {
      lvl = lvl || 0;

      if (!Object.keys(o).length)
        return (lvl ? '- ' : '') + '{}';

      var string = '',
          key,
          c = 0,
          i;

      for (i in o) {
        key = yml.string(i);
        string += repeatString('  ', lvl);
        if (indent && !c)
          string = string.slice(0, -1);
        string += key + ': ' + (isNonPrimitive(o[i]) ? '\n' : '') +
          processYAMLVariable(o[i], lvl + 1) + '\n';

        c++;
      }

      return string;
    },
    fn: function(fn) {
      return yml.string(fn.toString());
    },
    boolean: function(v) {
      return '' + v;
    },
    nullValue: function(v) {
      return '~';
    }
  };

  // Get the correct handler corresponding to variable type
  function processYAMLVariable(v, lvl, indent) {

    // Scalars
    if (typeof v === 'string')
      return yml.string(v);
    else if (typeof v === 'number')
      return yml.number(v);
    else if (typeof v === 'boolean')
      return yml.boolean(v);
    else if (typeof v === 'undefined' || v === null || isRealNaN(v))
      return yml.nullValue(v);

    // Nonscalars
    else if (isPlainObject(v))
      return yml.object(v, lvl, indent);
    else if (isArray(v))
      return yml.array(v, lvl);
    else if (typeof v === 'function')
      return yml.fn(v);

    // Error
    else
      throw TypeError('artoo.writers.processYAMLVariable: wrong type.');
  }

  // Converting JavaScript variables to a YAML string
  function toYAMLString(data) {
    return '---\n' + processYAMLVariable(data);
  }


  /**
   * Web Formats
   * ------------
   *
   * Converts JavaScript data into standard web formats such as querystrings.
   */

  function toQueryString(o, fn) {
    if (!isPlainObject(o))
      throw Error('artoo.writers.queryString: wrong arguments.');

    var s = '',
        k;

    for (k in o) {
      s +=
        (s ? '&' : '') +
        k + '=' +
        encodeURIComponent(typeof fn === 'function' ? fn(o[k]) : o[k]);
    }

    return s;
  }

  function toCookie(key, value, params) {
    params = params || {};

    var cookie = key + '=' + encodeURIComponent(value);

    if (params.days) {
      var date = new Date();
      date.setTime(date.getTime() + (params.days * 24 * 60 * 60 * 1000));
      cookie += '; expires=' + date.toGMTString();
    }

    if (params.path)
      cookie += '; path=' + params.path;

    if (params.domain)
      cookie += '; domain=' + params.domain;

    if (params.httpOnly)
      cookie += '; HttpOnly';

    if (params.secure)
      cookie += '; Secure';

    return cookie;
  }


  /**
   * Exporting
   */
  artoo.writers = {
    cookie: toCookie,
    csv: toCSVString,
    queryString: toQueryString,
    yaml: toYAMLString
  };
}).call(this);
