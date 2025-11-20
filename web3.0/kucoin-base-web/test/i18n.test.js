import { matchPath } from 'react-router-dom';
import {
  getLangFromBase,
  getBaseFromLang,
  isRTLLanguage,
  getCurrentLang,
  getNextLocation,
} from 'utils/i18n';

describe('getLangFromBase', () => {
  it('should return the language for a valid base', () => {
    expect(getLangFromBase('zh-hant')).toBe('zh_HK');
    expect(getLangFromBase('fr')).toBe('fr_FR');
  });

  it('should return the default language if base is invalid', () => {
    expect(getLangFromBase('invalid-base')).toBe('en_US');
  });

  it('should return the default language if something wrong with global', () => {
    const originGlobalMap = window.__KC_LANGUAGES_BASE_MAP__;
    window.__KC_LANGUAGES_BASE_MAP__ = {};
    expect(getLangFromBase('zh-hant')).toBe('en_US');
    window.__KC_LANGUAGES_BASE_MAP__ = originGlobalMap;
  });
});

describe('getBaseFromLang', () => {
  it('should return the base for a valid non-default language', () => {
    expect(getBaseFromLang('zh_HK')).toBe('zh-hant');
    expect(getBaseFromLang('fr_FR')).toBe('fr');
  });

  it('should return an empty string for the default language', () => {
    expect(getBaseFromLang('en_US')).toBe('');
  });

  it('should return an empty string if language is invalid', () => {
    expect(getBaseFromLang('invalid_lang')).toBe('');
  });

  it('should return an empty string if something wrong with global', () => {
    const originGlobalMap = window.__KC_LANGUAGES_BASE_MAP__;
    window.__KC_LANGUAGES_BASE_MAP__ = {};
    expect(getBaseFromLang('en_US')).toBe('');
    window.__KC_LANGUAGES_BASE_MAP__ = originGlobalMap;
  });
});

describe('isRTLLanguage', () => {
  it('should return true for RTL languages', () => {
    expect(isRTLLanguage('ar_AE')).toBe(true);
    expect(isRTLLanguage('ur_PK')).toBe(true);
  });

  it('should return false for non-RTL languages', () => {
    expect(isRTLLanguage('en_US')).toBe(false);
    expect(isRTLLanguage('fr_FR')).toBe(false);
    expect(isRTLLanguage('zh_HK')).toBe(false);
    expect(isRTLLanguage('es_ES')).toBe(false);
    expect(isRTLLanguage('')).toBe(false);
    expect(isRTLLanguage(null)).toBe(false);
    expect(isRTLLanguage(undefined)).toBe(false);
  });
});

describe('getCurrentLang', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return defaultLang if matchPath returns null', () => {
    matchPath.mockReturnValue(null);
    const result = getCurrentLang();
    expect(result).toBe('en_US');
  });

  it('should return defaultLang if path is not a language path', () => {
    matchPath.mockReturnValue({ params: { lng: 'abc' } });
    const result = getCurrentLang();
    expect(result).toBe('en_US');
  });

  it('should return the matched language if found', () => {
    matchPath.mockReturnValue({ params: { lng: 'fr' } });
    const result = getCurrentLang();
    expect(result).toBe('fr_FR');
  });
});

describe('getNextLocation', () => {
  const originalWindowLocation = window.location;

  beforeAll(() => {
    delete window.location;
  });

  beforeEach(() => {
    window.location = {};
  });

  afterAll(() => {
    window.location = originalWindowLocation;
  });

  it('should get the right homepage url from the default lang to a valid non-default lang', () => {
    window.location.href = 'https://www.kucoin.com';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/zh-hant');
    window.location.href = 'https://www.kucoin.com/';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/zh-hant');
    window.location.href = 'https://www.kucoin.com?lang=en_US&test=1';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/zh-hant?test=1');
    window.location.href = 'https://www.kucoin.com/?lang=en_US&test=1';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/zh-hant?test=1');
  });

  it('should get the right homepage url from a valid non-default lang to the default lang', () => {
    window.location.href = 'https://www.kucoin.com/zh-hant';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/');
    window.location.href = 'https://www.kucoin.com/zh-hant/';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/');
    window.location.href = 'https://www.kucoin.com/zh-hant?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/?test=1');
    window.location.href = 'https://www.kucoin.com/zh-hant/?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/?test=1');
  });

  it('should get the right homepage url from a valid non-default lang to another valid non-default lang', () => {
    window.location.href = 'https://www.kucoin.com/zh-hant';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/uk');
    window.location.href = 'https://www.kucoin.com/zh-hant/';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/uk');
    window.location.href = 'https://www.kucoin.com/zh-hant?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/uk?test=1');
    window.location.href = 'https://www.kucoin.com/zh-hant/?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/uk?test=1');
  });

  it('should get the right non-homepage url from the default lang to a valid non-default lang', () => {
    window.location.href = 'https://www.kucoin.com/price/BTC';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/zh-hant/price/BTC');
    window.location.href = 'https://www.kucoin.com/price/BTC/';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/zh-hant/price/BTC');
    window.location.href = 'https://www.kucoin.com/price/BTC?lang=en_US&test=1';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/zh-hant/price/BTC?test=1');
    window.location.href = 'https://www.kucoin.com/price/BTC/?lang=en_US&test=1';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/zh-hant/price/BTC?test=1');
  });

  it('should get the right non-homepage url from a valid non-default lang to the default lang', () => {
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/price/BTC');
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC/';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/price/BTC');
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/price/BTC?test=1');
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC/?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/price/BTC?test=1');
  });

  it('should get the right non-homepage url from a valid non-default lang to another valid non-default lang', () => {
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/uk/price/BTC');
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC/';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/uk/price/BTC');
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/uk/price/BTC?test=1');
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC/?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/uk/price/BTC?test=1');
  });

  it('should return default language url if something wrong with global', () => {
    const originGlobalMap = window.__KC_LANGUAGES_BASE_MAP__;
    window.__KC_LANGUAGES_BASE_MAP__ = {};
    // default home to non-default home
    window.location.href = 'https://www.kucoin.com';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/');
    window.location.href = 'https://www.kucoin.com/';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/');
    window.location.href = 'https://www.kucoin.com?lang=en_US&test=1';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/?test=1');
    window.location.href = 'https://www.kucoin.com/?lang=en_US&test=1';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/?test=1');
    // non-default home to default home
    window.location.href = 'https://www.kucoin.com/zh-hant';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/');
    window.location.href = 'https://www.kucoin.com/zh-hant/';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/');
    window.location.href = 'https://www.kucoin.com/zh-hant?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/?test=1');
    window.location.href = 'https://www.kucoin.com/zh-hant/?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/?test=1');
    // non-default home to non-default home
    window.location.href = 'https://www.kucoin.com/zh-hant';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/');
    window.location.href = 'https://www.kucoin.com/zh-hant/';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/');
    window.location.href = 'https://www.kucoin.com/zh-hant?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/?test=1');
    window.location.href = 'https://www.kucoin.com/zh-hant/?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/?test=1');
    // default non-home to non-default non-home
    window.location.href = 'https://www.kucoin.com/price/BTC';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/price/BTC');
    window.location.href = 'https://www.kucoin.com/price/BTC/';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/price/BTC');
    window.location.href = 'https://www.kucoin.com/price/BTC?lang=en_US&test=1';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/price/BTC?test=1');
    window.location.href = 'https://www.kucoin.com/price/BTC/?lang=en_US&test=1';
    expect(getNextLocation('', 'zh_HK')).toBe('https://www.kucoin.com/price/BTC?test=1');
    // non-default non-home to default non-home
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/price/BTC');
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC/';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/price/BTC');
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/price/BTC?test=1');
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC/?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'en_US')).toBe('https://www.kucoin.com/price/BTC?test=1');
    // non-default non-home to non-default non-home
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/price/BTC');
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC/';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/price/BTC');
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/price/BTC?test=1');
    window.location.href = 'https://www.kucoin.com/zh-hant/price/BTC/?lang=zh_HK&test=1';
    expect(getNextLocation('/zh-hant', 'uk_UA')).toBe('https://www.kucoin.com/price/BTC?test=1');

    window.__KC_LANGUAGES_BASE_MAP__ = originGlobalMap;
  });
});
