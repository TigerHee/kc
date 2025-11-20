/**
 * Owner: victor.ren@kupotech.com
 */
import Bowser from 'bowser';
import semver from 'semver';
// import { captureException } from 'gbiz-next/sentry';

// polyfill 兼容要求
// chrome >= 64
// safari >= 12
// edge >= 79
// filefox >= 67
// opera >= 51

// webp 支持版本
// chrome >= 32
// safari >= 16
// edge >= 18
// filefox >= 65

export default function checkSupportWebp() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const browserName = browser.getBrowserName();
    const browserVersion = browser.getBrowserVersion();

    const versionMatch = browserVersion.match(/^(\d+\.\d+\.\d+)/);
    const cleanVersion = versionMatch ? versionMatch[0] : browserVersion;
    const coercedVersion = semver.coerce(cleanVersion);

    if (
      !browserName ||
      !coercedVersion ||
      (browserName.toLowerCase().includes('safari') && semver.lt(coercedVersion, '16.0.0'))
    ) {
      return false;
    }

    return true;
  } catch (e) {
    // captureException(e);
    return false;
  }
}
