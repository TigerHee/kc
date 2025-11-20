/**
 * Owner: willen@kupotech.com
 * 老谢我补点单侧
 */

import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'src/hooks/useSelector';
import useLocaleChange from 'hooks/useLocaleChange';
import { getLocaleFromBrowser, needConfirmLang } from 'tools/i18n';
import searchToJson from 'utils/searchToJson';
import storage from 'utils/storage';
import useLocaleOrder from 'hooks/useLocaleOrder';
import _ from 'lodash';

jest.mock('src/hooks/useSelector', () => ({
  useSelector: jest.fn(),
}));

jest.mock('lodash', () => {
  const originLodash = jest.requireActual('lodash');
  return {
    ...originLodash,
    some: jest.fn(),
  };
});

jest.mock('hooks/useLocaleChange');
jest.mock('utils/searchToJson');

jest.mock('tools/i18n', () => ({
  needConfirmLang: jest.fn(),
  getLocaleFromBrowser: jest.fn(),
  getCurrentLangFromPath: jest.fn(),
}));

jest.mock('utils/storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('test useLocaleOrder', () => {
  const tests = [
    {
      desc: 'hasLogin',
      mockState: {
        user: {
          user: {},
        },
      },
      mockStorage: null,
      searchMock: {},
      localeSupported: false,
    },
    {
      desc: 'hasLogin',
      mockState: {
        user: {
          user: {},
        },
      },
      mockStorage: null,
      searchMock: {},
      localeSupported: true,
      mockNeedConfirmLang: true,
    },
    {
      desc: 'noLogin',
      mockState: {
        user: {
          user: {},
        },
      },
      mockStorage: null,
      searchMock: {},
      localeSupported: true,
      mockNeedConfirmLang: true,
    },
  ];
  test.each(tests)(
    'useLocaleOrder $desc',
    ({ mockState, mockStorage, searchMock, mockNeedConfirmLang }) => {
      useSelector.mockImplementation((cb) => cb(mockState));
      storage.getItem.mockReturnValue(mockStorage);
      needConfirmLang.mockReturnValue(mockNeedConfirmLang);
      searchToJson.mockReturnValue(searchMock);
      _.some.mockReturnValue();
      const changeLocaleFn = jest.fn();
      useLocaleChange.mockReturnValue(changeLocaleFn);
      renderHook(() => useLocaleOrder());
      expect(changeLocaleFn).toHaveBeenCalled();
    },
  );
});
