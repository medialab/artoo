;(function(undefined) {
  'use strict';

  /**
   * artoo console abstraction
   * ==========================
   *
   * Console abstraction enabling artoo to perform a finer logging job than
   * standard one.
   */
  var _root = this,
       enhanced = artoo.browser.chrome || artoo.browser.firebug;

  // Log levels
  var levels = {
    verbose: '#33CCFF', // Cyan
    debug: '#000099',   // Blue
    info: '#009900',    // Green
    warning: 'orange',  // Orange
    error: 'red'        // Red
  };

  var priorities = ['verbose', 'debug', 'info', 'warning', 'error'];

  // Utilities
  function toArray(a, slice) {
    return Array.prototype.slice.call(a, slice || 0);
  }

  // Is the level allowed to log?
  function isAllowed(level) {
    var threshold = artoo.settings.log.level;

    if (artoo.helpers.isArray(threshold))
      return !!~threshold.indexOf(level);
    else
      return priorities.indexOf(level) >=
        priorities.indexOf(threshold);
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

  // Log header
  function logHeader(level) {
    var args = ['[artoo]: ' + (enhanced ? '%c' + level : '')];

    if (enhanced)
      args.push('color: ' + levels[level] + ';');
    args.push('-' + (enhanced ? '' : ' '));

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

    // Is this level allowed?
    if (!isAllowed(level))
      return;

    var msg = logHeader(level).concat(args);

    console.log.apply(
      console,
      (enhanced) ?
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
    ascii[ascii.length - 2] = ascii[ascii.length - 2] + '    artoo.js';

    console.log(ascii.join('\n') + '   v' + artoo.version);
  };
}).call(this);
