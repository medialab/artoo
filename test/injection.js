/**
 * Artoo.js Unit Tests Injection
 * ==============================
 *
 * Some helpers aiming at shimming a browser environment to ease some tests.
 */
import jsdom from 'jsdom';

const env = jsdom.jsdom;

const MARKUP = '<html><body></body></html>';

let currentEnv;

export function injectBrowserEnvironment() {
  currentEnv = env(MARKUP, {});

  global.window = currentEnv.defaultView;
  global.document = window.document;

  global.HTMLDocument = window.HTMLDocument;
  global.XMLDocument = function() {};
}

export function restoreOriginalEnvironment() {
  currentEnv = null;

  delete global.window;
  delete global.document;

  delete global.HTMLDocument;
  delete global.XMLDocument;
}
