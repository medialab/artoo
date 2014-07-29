;(function(undefined) {
  'use strict';

  /**
   * artoo beep
   * ===========
   *
   * Experimental feature designed to make artoo beep.
   */

  var sounds = [
    'announce', 'assert', 'determined', 'excited', 'flourish', 'hello',
    'laugh', 'music', 'original', 'playful', 'question', 'quick', 'sad',
    'sassy', 'scream', 'shocked', 'snappy', 'strange', 'talk', 'threat',
    'weep', 'welcome', 'whistling'
  ];

  // Helpers
  function randomSound() {
    return sounds[Math.floor(Math.random() * sounds.length)];
  }

  // Playing the base64 sound
  artoo.beep = function(sound) {
    sound = sound || randomSound();

    if (!~sounds.indexOf(sound))
      throw Error('artoo.beep: wrong sound specified.');

    new Audio(artoo.settings.beep.endpoint + sound + '.ogg').play();
  };

  artoo.beep.available = function() {
    return sounds;
  };

  // Creating shortcuts
  sounds.forEach(function(s) {
    artoo.beep[s] = function() {
      artoo.beep(s);
    };
  });
}).call(this);


// drop merry sassy
// replace laugh, sassy