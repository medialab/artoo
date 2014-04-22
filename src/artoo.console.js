;(function(undefined) {
  'use strict';

  /**
   * artoo console abstraction
   * ==========================
   *
   * Console abstraction enabling artoo to perform a finer logging job.
   */

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

  // Log override
  Artoo.prototype.log = function(level) {
    var hasLevel = (levels[level] !== undefined);
    level = hasLevel ? level : 'debug';

    console.log.apply(
      console,
      hasLevel ? Array.prototype.slice.call(arguments, 1) : arguments
    );
  };

  // Logo display
  Artoo.prototype.welcome = function() {
    var ascii = robot();

    ascii[ascii.length - 2] = ascii[ascii.length - 2] + '    ' + this.name;

    console.log(ascii.join('\n') + '   v' + this.version);
  };
}).call(this);
