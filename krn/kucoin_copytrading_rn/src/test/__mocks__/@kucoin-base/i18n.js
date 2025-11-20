/**
 * Owner: iron@kupotech.com
 */

const useLocale = jest.fn(() => ({currentLang: 'zh_HK'}));

module.exports = {
  useLocale,
  basename: '/zh-hant',
  currentLang: 'zh_HK',
};
