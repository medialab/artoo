/**
 * Artoo.js Cookie Writer
 * =======================
 *
 * Function creating a cookie string from the given parameters.
 */
export default function writeCookie(key, value, params = {}) {
  if (arguments.length === 1) {
    params = key;
    key = params.key;
    value = params.value;

    if (!key || !value)
      throw Error('artoo.writers.cookie: invalid parameters object.');
  }

  let cookie = `${key}=${encodeURIComponent(value)}`;

  if (params.expires) {
    cookie += `; Expires=${params.expires}`;
  }
  else if (params.days) {
    const date = new Date();
    date.setTime(date.getTime() + (params.days * 24 * 60 * 60 * 1000));
    cookie += `; Expires=${date.toGMTString()}`;
  }

  if (params.path)
    cookie += `; Path=${params.path}`;

  if (params.domain)
    cookie += `; Domain=${params.domain}`;

  if (params.httpOnly)
    cookie += '; HttpOnly';

  if (params.secure)
    cookie += '; Secure';

  return cookie;
}
