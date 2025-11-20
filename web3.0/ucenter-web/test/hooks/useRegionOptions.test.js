/**
 * Owner: vijay.zhou@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useRegionOptions from 'src/hooks/useRegionOptions';
import { _t } from 'src/tools/i18n';

// Mock i18n
jest.mock('src/tools/i18n', () => ({
  _t: jest.fn().mockReturnValue('Restricted'),
}));

describe('useRegionOptions', () => {

  // 测试基本的地区过滤功能
  test('should filter out OT code and transform regions correctly', () => {
    const mockRegions = [
      { code: 'CN', name: 'China', regionType: 3, icon: 'cn.svg' },
      { code: 'US', name: 'United States', regionType: 3, icon: 'us.svg' },
      { code: 'OT', name: 'Other', regionType: 3, icon: 'ot.svg' },
    ];

    const { result } = renderHook(() => useRegionOptions(mockRegions));
    
    expect(result.current).toHaveLength(2);
    expect(result.current.map(item => item.value)).toEqual(['CN', 'US']);
    expect(result.current[0].title).toBe('China');
    expect(result.current[1].title).toBe('United States');
  });

  // 测试站点类型过滤功能
  test('should filter by siteType when provided', () => {
    const mockRegions = [
      { code: 'CN', name: 'China', regionType: 3, siteType: 'global', icon: 'cn.svg' },
      { code: 'US', name: 'United States', regionType: 3, siteType: 'us', icon: 'us.svg' },
      { code: 'JP', name: 'Japan', regionType: 3, siteType: 'global', icon: 'jp.svg' },
    ];

    const { result } = renderHook(() => useRegionOptions(mockRegions, 'global'));
    
    expect(result.current).toHaveLength(2);
    expect(result.current.map(item => item.value)).toEqual(['CN', 'JP']);
  });

  // 测试受限制地区的处理
  test('should handle restricted regions correctly', () => {
    const mockRegions = [
      { code: 'CN', name: 'China', regionType: 1, icon: 'cn.svg' },
      { code: 'US', name: 'United States', regionType: 2, icon: 'us.svg' },
      { code: 'JP', name: 'Japan', regionType: 3, icon: 'jp.svg' },
    ];

    const { result } = renderHook(() => useRegionOptions(mockRegions));
    
    // 检查受限制地区是否被正确标记为禁用
    expect(result.current[0].disabled).toBe(true);
    expect(result.current[1].disabled).toBe(true);
    expect(result.current[2].disabled).toBeUndefined();

    // 验证受限制地区的标签渲染
    const RestrictedLabel1 = result.current[0].label;
    expect(RestrictedLabel1).toBeDefined();
    expect(typeof RestrictedLabel1).toBe('function');

    // 验证非受限制地区的标签渲染
    const NormalLabel = result.current[2].label;
    expect(NormalLabel).toBeDefined();
    expect(typeof NormalLabel).toBe('function');
  });

  // 测试默认的 siteType 处理
  test('should handle missing siteType correctly', () => {
    const mockRegions = [
      { code: 'CN', name: 'China', regionType: 3, siteType: null, icon: 'cn.svg' },
    ];

    const { result } = renderHook(() => useRegionOptions(mockRegions));
    
    expect(result.current[0].siteType).toBe('global');
  });

  // 测试空数组输入
  test('should handle empty regions array', () => {
    const { result } = renderHook(() => useRegionOptions([]));
    expect(result.current).toHaveLength(0);
  });
});
