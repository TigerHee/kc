/**
 * Owner: eli.xiang@kupotech.com
 */
import { useIpCountryCode } from '@kucoin-biz/hooks';
import { renderHook } from '@testing-library/react-hooks';
import useIpCountry from 'src/hooks/useIpCountry'; // 根据实际路径调整

// 模拟 useIpCountryCode
jest.mock('@kucoin-biz/hooks', () => ({
  useIpCountryCode: jest.fn(),
}));

describe('useIpCountry', () => {
  it('should return correct values for GB country code', () => {
    useIpCountryCode.mockReturnValue('GB');

    const { result } = renderHook(() => useIpCountry());

    expect(result.current).toEqual({
      isGB: true,
      isIN: false,
      isNoCountry: false,
      isGBOrNoCountry: true,
    });
  });

  it('should return correct values for IN country code', () => {
    useIpCountryCode.mockReturnValue('IN');

    const { result } = renderHook(() => useIpCountry());

    expect(result.current).toEqual({
      isGB: false,
      isIN: true,
      isNoCountry: false,
      isGBOrNoCountry: false,
    });
  });

  it('should return correct values when there is no country code', () => {
    useIpCountryCode.mockReturnValue(undefined);

    const { result } = renderHook(() => useIpCountry());

    expect(result.current).toEqual({
      isGB: false,
      isIN: false,
      isNoCountry: true,
      isGBOrNoCountry: true,
    });
  });
});
