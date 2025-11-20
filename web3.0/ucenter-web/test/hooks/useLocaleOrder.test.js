import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
// import useLocaleChange from 'src/hooks/useLocaleChange';
import { changeLocale } from '@kucoin-base/i18n';
import { waitFor } from '@testing-library/react';
import useLocaleOrder from 'src/hooks/useLocaleOrder';
import { getLocaleFromBrowser, needConfirmLang } from 'src/tools/i18n';
import storage from 'src/utils/storage';
import searchToJson from 'utils/searchToJson';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('hooks/useLocaleChange');
jest.mock('utils/searchToJson');
jest.mock('utils/storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
jest.mock('tools/i18n', () => ({
  getCurrentLangFromPath: jest.fn(),
  getLocaleFromBrowser: jest.fn(),
  needConfirmLang: jest.fn(),
}));

jest.mock('@kucoin-base/i18n', () => ({
  changeLocale: jest.fn(),
  currentLocale: 'en_US',
  localeBasename: '',
}));

describe('useLocaleOrder', () => {
  beforeEach(() => {
    useSelector.mockReturnValue({ user: { language: 'en_US' } });
    searchToJson.mockReturnValue({ lang: 'es_ES' });
    storage.getItem.mockReturnValue('de_DE');
    getLocaleFromBrowser.mockReturnValue('it_IT');
    needConfirmLang.mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set language based on user preference or query param', () => {
    needConfirmLang.mockReturnValue(false);
    useSelector.mockReturnValue({ user: { language: 'en_US' } });
    const { result } = renderHook(() => useLocaleOrder());
    waitFor(() => {
      expect(changeLocale).toHaveBeenCalledWith('es_ES');
      expect(storage.setItem).toHaveBeenCalledWith('lang', 'es_ES');
    });
  });

  it('should fall back to browser language if no user language or query param', () => {
    useSelector.mockReturnValue({ user: { language: 'en_US' } });
    searchToJson.mockReturnValue({ lang: null });
    const { result } = renderHook(() => useLocaleOrder());
    waitFor(() => {
      expect(changeLocale).toHaveBeenCalledWith('it_IT');
      expect(storage.setItem).toHaveBeenCalledWith('lang', 'it_IT');
    });
  });

  it('should use default language if the determined language is unsupported', () => {
    useSelector.mockReturnValue({ user: { language: 'unsopported' } });
    searchToJson.mockReturnValue({ lang: 'unsupported' });
    waitFor(() => {
      const { result } = renderHook(() => useLocaleOrder());

      expect(changeLocale).toHaveBeenCalledWith('en_US', true);
      expect(storage.setItem).toHaveBeenCalledWith('lang', 'en_US');
    });
  });

  it('should not change language if the current language is the same as the determined language', () => {
    useSelector.mockReturnValue({ user: { language: 'en_US' } });
    searchToJson.mockReturnValue({ lang: 'en_US' });
    const { result } = renderHook(() => useLocaleOrder());
    waitFor(() => {
      expect(changeLocale).not.toHaveBeenCalled();
    });
  });

  it('should update storage if language changes', () => {
    storage.getItem.mockReturnValue('oldLang');
    const { result } = renderHook(() => useLocaleOrder());
    waitFor(() => {
      expect(storage.setItem).toHaveBeenCalledWith('lang', 'es_ES');
    });
  });
});

// beforeEach(() => {
//   jest.clearAllMocks(); // 清除所有的 mock
// });

// jest.mock('tools/i18n', () => ({
//   getLocaleFromBrowser: () => 'zh_HK',
//   getCurrentLangFromPath: jest.fn(() => 'zh_HK'),
//   basename: '',
// }));

// test('test useLocaleOrder', () => {
//   renderHook(useLocaleOrder);
// });
