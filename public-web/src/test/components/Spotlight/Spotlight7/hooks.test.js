/*
 * Owner: jessie@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { act, renderHook } from '@testing-library/react-hooks';
import {
  useDeposit,
  useKyc,
} from 'components/Spotlight/SpotlightR7/hooks';
import { useDispatch } from 'react-redux';

const { useSelector } = require('src/hooks/useSelector');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  shallowEqual: jest.fn(),
}));

jest.mock('src/hooks/useSelector', () => {
  return {
    __esModule: true,
    default: null,
    useSelector: jest.fn(() => ({ countryInfo: 'countryInfo' })),
  };
});
jest.mock('@kucoin-base/bridge', () => ({ open: jest.fn(), isApp: jest.fn() }));
jest.mock('tools/i18n', () => ({ addLangToPath: (path) => path, _t: (key) => key }));

jest.mock('utils/siteConfig', () => ({ KUCOIN_HOST: 'http://localhost/' }));

const timeNum = 600000;

describe('Custom hooks', () => {
  beforeEach(() => {
    window.onListenEvent = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
    delete window.onListenEvent;
  });

  test('useKyc isInApp true', () => {
    JsBridge.isApp.mockReturnValue(true);
    const { result } = renderHook(() => useKyc());
    const { handleKyc } = result.current;
    act(() => {
      handleKyc();
    });
    expect(JsBridge.open).toHaveBeenCalled();
  });

  test('useKyc isInApp false', () => {
    JsBridge.isApp.mockReturnValue(false);
    const { result } = renderHook(() => useKyc());
    const { handleKyc } = result.current;
    act(() => {
      handleKyc();
    });

    expect(window.location.href).toBe('http://localhost/');
  });

  test('useDeposit isInApp true', () => {
    JsBridge.isApp.mockReturnValue(true);
    const { result } = renderHook(() => useDeposit());
    const { handleDeposit } = result.current;
    act(() => {
      handleDeposit();
    });
    expect(JsBridge.open).toHaveBeenCalled();
  });
  test('useDeposit isInApp false', () => {
    JsBridge.isApp.mockReturnValue(false);
    const { result } = renderHook(() => useDeposit());
    const { handleDeposit } = result.current;
    act(() => {
      handleDeposit();
    });

    expect(window.location.href).toBe('http://localhost/');
  });
});

