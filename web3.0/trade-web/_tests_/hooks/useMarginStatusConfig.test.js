
import { renderHook } from '@testing-library/react-hooks';
import { useTheme } from '@kux/mui';
import useMarginModel from 'src/trade4.0/hooks/useMarginModel';
import useMarginStatusConfig from 'src/trade4.0/hooks/useMarginStatusConfig.js';

jest.mock('@kux/mui', () => ({
  useTheme: jest.fn(),
}));

jest.mock('src/trade4.0/hooks/useMarginModel');

describe('useMarginStatusConfig', () => {
  let mockUseTheme;
  let mockUseMarginModel;

  beforeEach(() => {
    mockUseTheme = useTheme;
    mockUseMarginModel = useMarginModel;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct status config', () => {
    const params = {
      symbol: 'mockSymbol',
      status: 'mockStatus',
      liabilityRate: 'liabilityRate',
    };

    const mockColors = {
      secondary: 'mockSecondaryColor',
      secondary12: 'mockSecondary12Color',
      primary: 'mockPrimaryColor',
      primary12: 'mockPrimary12Color',
      complementary: 'mockComplementaryColor',
      complementary12: 'mockComplementary12Color',
    };

    const mockMarginModel = {
      statusInfo: { code: 'mockCode' },
      accountConfigs: { riskGrade: '1,2' },
      liabilityRate: '10',
    };

    mockUseTheme.mockReturnValue({ colors: mockColors });
    mockUseMarginModel.mockReturnValue(mockMarginModel);

    const { result } = renderHook(() => useMarginStatusConfig(params));

    expect(result.current).toEqual({});
  });
});
