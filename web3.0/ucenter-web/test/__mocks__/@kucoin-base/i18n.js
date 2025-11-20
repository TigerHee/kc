/**
 * Owner: iron@kupotech.com
 */
const React = require('react');

const useLocale = jest.fn(() => ({
  currentLang: 'zh_HK',
  changeLocale: jest.fn(),
  localeBasename: '',
}));
const injectLocale = jest.fn((WrappedComponent) => (props) => {
  return <WrappedComponent {...props} currentLang="zh_HK" />;
});

module.exports = {
  useLocale,
  injectLocale,
  basename: '/zh-hant',
  currentLang: 'ja',
  getCurrentLangFromPath: () => 'ja',
};
