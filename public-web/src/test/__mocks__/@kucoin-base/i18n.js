/**
 * Owner: iron@kupotech.com
 */

const useLocale = jest.fn(() => ({ currentLang: 'zh_HK' }));

module.exports = {
  useLocale,
  injectLocale: jest.fn(),
  basename: '/zh-hant',
};
