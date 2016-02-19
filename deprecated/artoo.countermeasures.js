;(function(undefined) {
  'use strict';

  /**
   * artoo countermeasures
   * ======================
   *
   * Compilation of artoo countermeasures against popular console hacks
   * deployed by websites to prevent javasript fiddling.
   */

  // Checking whether the console functions have been replaced by empty ones.
  // Examples: twitter, gmail
  function shuntedConsole() {

    // Detection
    if (artoo.browser.firebug ||
        ~console.log.toString().search(/\[native code\]/i))
      return;

    // The console have been shunted, repairing...
    ['log', 'info', 'debug', 'warn'].forEach(function(fn) {
      console[fn] = console.__proto__[fn];
    });

    artoo.log.warning('The console have been shunted by the website you ' +
                      'are visiting. artoo has repaired it.');
  }

  // Registering functions
  artoo.once('countermeasures', function() {
    shuntedConsole();
  });
}).call(this);
