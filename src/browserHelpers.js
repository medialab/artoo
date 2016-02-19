/**
 * Artoo.js Browser Helpers
 * =========================
 *
 * Browser specific helpers.
 */

/**
 * Checking whether the given value is a document.
 */
export function isDocument(value) {
  return value instanceof HTMLDocument ||
         value instanceof XMLDocument;
}

/**
 * Return a valid jQuery selector from a string or XML document.
 */
export function jquerify($, value) {
  if (isDocument(value))
    return $(value);
  return $('<div />').append(value);
}
