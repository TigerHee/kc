/**
 * Owner: brick.fan@kupotech.com
 *
 * 标记用户访问过
 * https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/847481720/EEA
 */

try {
  if (document.cookie.indexOf("x-visited=true") === -1) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 3);
    const expires = date.toUTCString();
    document.cookie = `x-visited=true; expires=${expires}; path=/; Secure; SameSite=Strict;`;
  }
} catch (e) {
  console.error("setVisitedCookie error", e);
}
