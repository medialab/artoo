/**
 * Artoo.js Cookie Parser
 * =======================
 *
 * Function parsing a single cookie string into an object.
 */
export default function parseCookie(cookieString) {
  const cookie = {
    httpOnly: false,
    secure: false
  };

  if (!cookieString.trim())
    return;

  cookieString.split('; ').forEach(item => {

    // Path
    if (~item.search(/path=/i)) {
      cookie.path = item.split('=')[1];
    }
    else if (~item.search(/expires=/i)) {
      cookie.expires = item.split('=')[1];
    }
    else if (~item.search(/httponly/i) && !~item.search('=')) {
      cookie.httpOnly = true;
    }
    else if (~item.search(/secure/i) && !~item.search('=')) {
      cookie.secure = true;
    }
    else {
      const [key, value] = item.split('=');
      cookie.key = key;
      cookie.value = decodeURIComponent(value);
    }
  });

  return cookie;
}
