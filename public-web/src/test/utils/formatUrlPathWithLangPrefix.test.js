/**
 * Owner: Willen@kupotech.com
 */

import formatUrlPathWithLangPrefix from 'utils/formatUrlPathWithLangPrefix';

describe('formatUrlPathWithLangPrefix', () => {
  test('formatUrlPathWithLangPrefix with host and urlPath', () => {
    expect(formatUrlPathWithLangPrefix('/price/BTC', 'https://www.example.com')).toBe(
      'https://www.example.com/zh-hant/price/BTC',
    );
  });

  test('formatUrlPathWithLangPrefix with host and urlPath, host without https', () => {
    expect(formatUrlPathWithLangPrefix('/price/BTC', 'www.example.com')).toBe(
      'https://www.example.com/zh-hant/price/BTC',
    );
  });

  test('formatUrlPathWithLangPrefix with host and urlPath, host with pathname', () => {
    expect(formatUrlPathWithLangPrefix('/price/BTC', 'https://www.example.com/pathname')).toBe(
      'https://www.example.com/zh-hant/pathname/price/BTC',
    );
  });

  test('formatUrlPathWithLangPrefix with only urlPath', () => {
    expect(formatUrlPathWithLangPrefix('/price/BTC')).toBe('/zh-hant/price/BTC');
  });
});
