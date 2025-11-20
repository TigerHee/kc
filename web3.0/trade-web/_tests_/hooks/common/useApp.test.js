/**
 * Owner: garuda@kupotech.com
 */

import { useSelector } from 'react-redux';

import { isInApp, setAppInfo, useAppInfo } from '@/hooks/common/useApp';

import JsBridge from '@kucoin-base/bridge';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@kucoin-base/bridge', () => ({
  isApp: jest.fn(),

  open: jest.fn(),
}));

describe('appInfo functions', () => {
  describe('isInApp', () => {
    it('should return true when JsBridge.isApp returns true', () => {
      JsBridge.isApp.mockReturnValue(true);

      expect(isInApp()).toBe(true);
    });

    it('should return false when JsBridge.isApp returns false', () => {
      JsBridge.isApp.mockReturnValue(false);

      expect(isInApp()).toBe(false);
    });
  });

  describe('setAppInfo', () => {
    it('should dispatch app/setAppInfo with correct payload', () => {
      const dispatch = jest.fn();

      const mockParams = { data: { key: 'value' } };

      JsBridge.open.mockImplementation((_, cb) => {
        cb(mockParams);
      });

      setAppInfo({ dispatch });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'app/setAppInfo',

        payload: mockParams.data,
      });
    });
  });

  describe('useAppInfo', () => {
    it('should return appInfo from state', () => {
      const mockAppInfo = { key: 'value' };

      useSelector.mockImplementation((selector) => selector({ user: { appInfo: mockAppInfo } }));

      const result = useAppInfo();

      expect(result).toEqual(mockAppInfo);
    });
  });
});
