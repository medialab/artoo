;(function(undefined) {
  'use strict';
  artoo.init();
  return;

  var root = this;

  if (!console.clear)
    console.clear = function() {};

  // State
  var initalized = false;

  // Unleash functions
  artoo.unleash = artoo.breakFree = function() {
    if (initalized) {
      artoo.log.info('I am already free!');
      return;
    }

    artoo.init();
    initalized = true;
  };

  // On ready
  artoo.ready(function() {
    console.log('');
    artoo.log.info('Well, now that I am free, we might as well steal as many ' +
                   'data as we can before quitting this ugly site.');
    artoo.log.info('What about the tasty sidebar on the left? Let\'s extract data from it.');
    console.log('');
    artoo.log.info('Open it and see how it is made.');
    artoo.waitFor(function() { return $('.sidebar-checkbox').prop('checked'); }, sidebarOpened);
  });

  function sidebarOpened() {
    console.clear();
    artoo.log.info('Yay! the sidebar is toggled.');
    artoo.log.info('It seems that every item of the sidebar has the "sidebar-nav-item". This should be pretty easy.');
    artoo.log.info('Just type the following command:\n');
    log("`var niceList = artoo.scrape('.sidebar-nav-item', 'text');`");

    artoo.waitFor(function() { return root.niceList && root.niceList[0] === 'Home'; }, niceListFirst);
  }

  function niceListFirst() {
    console.clear();
    artoo.log.info('I notice that you are a gifted one.');
  }

  // Warning
  log('_Help! I am trapped!_');
  log('You are my only hope...');
  log('')
  log('Could you please try something?');
  log('');
  log('`artoo.breakFree();`, `artoo.unleash();`, I don\'t know...');
  log('');
  log('You seem clever, you should be able to figure it out.\n');
}).call(this);
