;(function(undefined) {
  'use strict';

  /**
   * artoo console abstraction
   * ==========================
   *
   * Console abstraction enabling artoo to perform a finer logging job.
   */

  // Utilities
  function toArray(a, slice) {
    return Array.prototype.slice.call(a, slice || 0);
  }

  // Return the logo ASCII array
  function robot() {
    return [
      '   .-""-.   ',
      '  /[] _ _\\  ',
      ' _|_o_LII|_ ',
      '/ | ==== | \\',
      '|_| ==== |_|',
      ' ||LI  o ||',
      ' ||\'----\'||',
      '/__|    |__\\'
    ];
  }

  // Log levels
  var levels = {
    verbose: 'cyan',
    debug: 'blue',
    info: 'green',
    warn: 'orange',
    error: 'red'
  };

  // Log header
  function logHeader(name, level) {
    return [
      '[' + name + ']: %c' + level,
      'color: ' + levels[level] + ';',
      '-'
    ];
  }

  // Log override
  Artoo.prototype.log = function(level) {
    var hasLevel = (levels[level] !== undefined),
        slice = hasLevel ? 1 : 0,
        args = Array.prototype.slice.call(arguments, slice);

    level = hasLevel ? level : 'debug';

    console.log.apply(
      console,
      logHeader(this.name, level).concat(args)
    );
  };

  // Log shortcuts
  function makeShortcut(level) {
    Artoo.prototype[level] = function() {
      this.log.apply(this,
        [level].concat(Array.prototype.slice.call(arguments)));
    };
  }

  for (var l in levels)
    makeShortcut(l);

  // Logo display
  Artoo.prototype.welcome = function() {
    var ascii = robot();

    ascii[ascii.length - 2] = ascii[ascii.length - 2] + '    ' + this.name;

    console.log(ascii.join('\n') + '   v' + this.version);
  };
}).call(this);
