/**
 * Artoo.js Helpers
 * =================
 *
 * Miscellaneous helper functions.
 */

/**
 * Checking that the given value is a plain object.
 */
export function isPlainObject(value) {
  return value &&
         typeof value === 'object' &&
         !Array.isArray(value) &&
         !(value instanceof Date) &&
         !(value instanceof RegExp) &&
         !(typeof Map === 'function' && value instanceof Map) &&
         !(typeof Set === 'function' && value instanceof Set);
}
