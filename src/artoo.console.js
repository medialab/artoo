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

  // Log override
  Artoo.prototype.log = function() {
    console.log.apply(console, arguments);
  };

  // Logo display
  Artoo.prototype.welcome = function() {
    var ascii = robot();

    ascii[ascii.length - 2] = ascii[ascii.length - 2] + '    ' + this.name;

    console.log(ascii.join('\n') + '   v' + this.version);
  };
}).call(this);
