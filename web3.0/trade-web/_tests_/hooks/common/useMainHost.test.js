/**
 * Owner: garuda@kupotech.com
 */

import { isInApp, useAppInfo } from '@/hooks/common/useApp';

import { useMainHost } from '@/hooks/common/useMainHost';

import { siteCfg } from 'config';

jest.mock('@/hooks/common/useApp', () => ({
  isInApp: jest.fn(),

  useAppInfo: jest.fn(),
}));

describe('useMainHost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return appMainHost when in app and appInfo has webHost', () => {
    const mockAppInfo = { webHost: 'app.example.com' };

    useAppInfo.mockReturnValue(mockAppInfo);

    isInApp.mockReturnValue(true);

    const result = useMainHost();

    expect(result).toBe('https://app.example.com');
  });

  it('should return KUCOIN_HOST_COM when in app and appInfo does not have webHost', () => {
    const mockAppInfo = {};

    useAppInfo.mockReturnValue(mockAppInfo);

    isInApp.mockReturnValue(true);

    const result = useMainHost();

    expect(result).toBe(siteCfg.KUCOIN_HOST_COM);
  });

  it('should return KUCOIN_HOST when not in app', () => {
    const mockAppInfo = { webHost: 'app.example.com' };

    useAppInfo.mockReturnValue(mockAppInfo);

    isInApp.mockReturnValue(false);

    const result = useMainHost();

    expect(result).toBe(siteCfg.KUCOIN_HOST);
  });

  it('should return KUCOIN_HOST when not in app and appInfo does not have webHost', () => {
    const mockAppInfo = {};

    useAppInfo.mockReturnValue(mockAppInfo);

    isInApp.mockReturnValue(false);

    const result = useMainHost();

    expect(result).toBe(siteCfg.KUCOIN_HOST);
  });
});
