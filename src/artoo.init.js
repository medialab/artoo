;(function(undefined) {
  'use strict';

  /**
   * artoo initialization
   * =====================
   *
   * Loading a single instance of artoo into the web page while checking for
   * potential usurpers and acting accordingly.
   */

  // Checking preexistence of artoo and potential usurpation
  var exists = typeof this.artoo !== 'undefined' ||
               typeof this.detoo !== 'undefined',
      usurper = exists && this.artoo.passphrase !== 'detoo',
      name;

  if (exists && !usurper) {
    console.log('An artoo already works within this page.' +
                'no need to invoke another one.');
    return;
  }

  if (usurper) {
    console.log('An usurper artoo lives within this page. Renaming artoo ' +
                'to "detoo".');
    name = 'detoo';
  }
  else {
    name = 'artoo';
  }

  // Exporting
  this[name] = new Artoo(name);
}).call(this);
