/*
 * Owner: terry@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useAdaptiveToast from 'src/hooks/useAdaptiveToast.js';

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

jest.mock('@kux/mui/hooks', () => ({
  useSnackbar: () => {
    return {
      message: {
        success: jest.fn(),
      },
    };
  },
}));

describe('useAdaptiveToast', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should return correct toast function', () => {
    const { result } = renderHook(() => useAdaptiveToast());
    expect(typeof result.current).toBe('function');
    result.current('123');
    result.current({
      msg: 'test',
      type: 'success',
    });
    result.current({
      msg: undefined,
      type: 'success',
    });
  });
});
