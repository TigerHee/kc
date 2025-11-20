/**
 * Owner: ella@kupotech.com
 */
function getUrlPathname(href) {
  if (typeof href !== 'string') {
    return '';
  }
  try {
    const url = new URL(href, window.location.origin);
    return window.btoa(url.pathname);
  } catch (error) {
    return window.btoa(href);
  }
}

export function saveSpm2SessionStorage(url, spm) {
  if (!spm) {
    return false;
  }
  try {
    const spmKey = getUrlPathname(url);
    if (!spmKey) {
      return false;
    }
    return sessionStorage.setItem(spmKey, spm);
  } catch (error) {
    console.warn(
      'Sorry, the browser’s storage space is full. To ensure the normal usage, please visit Tools > Clear Recent History > Cookies and select All in Time Range to release the storage space.',
    );
  }
  return false;
}

export function getSavedSpm(url) {
  const spmKey = getUrlPathname(url);
  return sessionStorage.getItem(spmKey);
}

export function initSpmParam(url) {
  const urlObj = new URL(url, window.location.origin);
  const searchSpm = urlObj.searchParams.get('spm');
  if (searchSpm) {
    saveSpm2SessionStorage(url, searchSpm);
  }
}
