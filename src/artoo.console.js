;(function(undefined) {
  'use strict';

  /**
   * artoo console abstraction
   * ==========================
   *
   * Console abstraction enabling artoo to perform a finer logging job.
   */
  var _root = this,
       chrome = 'chrome' in _root;

  // Utilities
  function toArray(a, slice) {
    return Array.prototype.slice.call(a, slice || 0);
  }

  // Return the logo ASCII array
  function robot() {
    return [
      (chrome ? ' ' : '') + '  .-""-.   ',
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
    verbose: '#33CCFF',
    debug: '#000099',
    info: '#009900',
    warning: 'orange',
    error: 'red'
  };

  // Log header
  function logHeader(level) {
    var args = ['[artoo]: ' + (chrome ? '%c' + level : '')];

    if (chrome)
      args.push('color: ' + levels[level] + ';');
    args.push('-');

    return args;
  }

  // Log override
  artoo.log = function(level) {
    if (!artoo.settings.log.enabled)
      return;

    var hasLevel = (levels[level] !== undefined),
        slice = hasLevel ? 1 : 0,
        args = toArray(arguments, slice);

    level = hasLevel ? level : 'debug';

    var msg = logHeader(level).concat(args);

    console.log.apply(
      console,
      (chrome) ?
        msg :
        [msg.reduce(function(a, b) { return a + b; }, '')]
    );
  };

  // Log shortcuts
  function makeShortcut(level) {
    artoo.log[level] = function() {
      artoo.log.apply(artoo.log,
        [level].concat(toArray(arguments)));
    };
  }

  for (var l in levels)
    makeShortcut(l);

  // Plain log
  artoo.log.plain = function() {
    if (artoo.settings.log.enabled)
      console.log.apply(console, arguments);
  };

  // Logo display
  artoo.log.welcome = function() {
    if (!artoo.settings.log.enabled)
      return;

    var ascii = robot();
    ascii[ascii.length - 2] = ascii[ascii.length - 2] + '    artoo';

    console.log(ascii.join('\n') + '   v' + artoo.version);
  };
}).call(this);
