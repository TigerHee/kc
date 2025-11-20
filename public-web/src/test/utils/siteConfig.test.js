/**
 * Owner: larvide.peng@kupotech.com
 */

describe('utils siteConfig', () => {
  test('should initialize siteCfg with window._WEB_RELATION_ if it is defined', () => {
    window._WEB_RELATION_ = { key: 'value' };

    const siteCfg = require('src/utils/siteConfig').default;
    expect(siteCfg).toEqual({ key: 'value' });
  });

  test('should initialize siteCfg as an empty object if window._WEB_RELATION_ is not defined', () => {
    const siteCfg = require('src/utils/siteConfig').default;
    expect(siteCfg).toEqual({ key: 'value' });
  });

  test('should initialize siteCfg as an empty object if window._WEB_RELATION_ is undefined', () => {
    window._WEB_RELATION_ = undefined;
    const siteCfg = require('src/utils/siteConfig').default;
    expect(siteCfg).toEqual({ key: 'value' });
  });
});
