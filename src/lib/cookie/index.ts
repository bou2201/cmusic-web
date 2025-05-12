/**
 * Cookie utility library for managing browser cookies
 */

/**
 * Get a cookie value by name
 * @param name The name of the cookie to retrieve
 * @returns The cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null; // Check for server-side rendering

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  return null;
};

/**
 * Set a cookie with the given name and value
 * @param name The name of the cookie
 * @param value The value to store
 * @param options Optional cookie settings
 */
export const setCookie = (
  name: string,
  value: string,
  options: {
    days?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {},
): void => {
  if (typeof document === 'undefined') return; // Check for server-side rendering

  const { days = 7, path = '/', domain, secure, sameSite = 'lax' } = options;

  // Calculate expiration date
  const expires = days ? new Date(Date.now() + days * 864e5).toUTCString() : '';

  // Build cookie string
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  if (expires) cookieString += `; expires=${expires}`;
  if (path) cookieString += `; path=${path}`;
  if (domain) cookieString += `; domain=${domain}`;
  if (secure) cookieString += '; secure';
  if (sameSite) cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
};

/**
 * Remove a cookie by setting its expiration date to the past
 * @param name The name of the cookie to remove
 * @param options Optional cookie settings
 */
export const removeCookie = (
  name: string,
  options: {
    path?: string;
    domain?: string;
  } = {},
): void => {
  if (typeof document === 'undefined') return; // Check for server-side rendering

  // Set expiration to a past date to remove the cookie
  setCookie(name, '', {
    days: -1,
    path: options.path,
    domain: options.domain,
  });
};

/**
 * Check if a cookie exists
 * @param name The name of the cookie to check
 * @returns True if the cookie exists, false otherwise
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};
