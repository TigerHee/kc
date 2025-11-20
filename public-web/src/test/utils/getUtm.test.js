/**
 * Owner: willen@kupotech.com
 */


describe('test getUtm', () => {
  test('getShareLink', () => {
    window._WEB_RELATION_ = {
      MAINSITE_HOST_COM: 'https://www.kucoin.com',
    };

    const { getShareLink } = require('src/utils/getUtm');
    expect(getShareLink().includes('kucoin')).toBe(true);
    const url = getShareLink({
      rcode: 'efg',
      utm_medium: 'test',
      utm_campaign: 'test',
    });
    expect(url.includes('=efg')).toBe(true);
    expect(url.includes('utm_medium=test')).toBe(true);
  });
  test('getShareLink without sitConfig', () => {
    window._WEB_RELATION_ = {};
    const { getShareLink } = require('src/utils/getUtm');
    expect(typeof getShareLink() === 'string').toBe(true);
  });
});
