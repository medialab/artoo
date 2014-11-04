;(function(undefined) {
  'use strict';

  /**
   * artoo beep
   * ===========
   *
   * Experimental feature designed to make artoo beep.
   */

  var collections = {
    greet: ['announce', 'excited', 'hello', 'music', 'original', 'welcome'],
    info: ['determined', 'flourish', 'playful', 'sassy', 'talk', 'whistling'],
    warn: ['assert', 'laugh', 'question', 'quick', 'strange', 'threat'],
    error: ['sad', 'scream', 'shocked', 'weep']
  };

  var sounds = collections.greet
    .concat(collections.info)
    .concat(collections.warn)
    .concat(collections.error);

  // Helpers
  function randomInArray(a) {
    return a[Math.floor(Math.random() * a.length)];
  }

  // Playing the base64 sound
  artoo.beep = function(sound) {
    var chosenSound;
    if (artoo.helpers.isArray(sound))
      chosenSound = randomInArray(sound);
    else
      chosenSound = sound || randomInArray(sounds);

    if (chosenSound in collections)
      chosenSound = randomInArray(collections[chosenSound]);

    if (!~sounds.indexOf(chosenSound))
      throw Error('artoo.beep: wrong sound specified.');

    new Audio(artoo.settings.beep.endpoint + chosenSound + '.ogg').play();
  };

  // Exposing available beeps
  Object.defineProperty(artoo.beep, 'available', {
    value: sounds
  });

  // Exposing collections
  Object.defineProperty(artoo.beep, 'collections', {
    value: collections
  });

  // Creating shortcuts
  // NOTE: not using bind here to avoid messing with phantomjs
  sounds.concat(Object.keys(collections)).forEach(function(s) {
    artoo.beep[s] = function() {
      artoo.beep(s);
    };
  });
}).call(this);
