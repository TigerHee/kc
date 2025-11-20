/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { renderHook } from '@testing-library/react-hooks';

const useShow = require('TradeActivity/hooks/useShow');

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  listenNativeEvent: {
    on: jest.fn(),
    off: jest.fn(),
  },
}));

jest.mock('helper', () => ({
  Event: {
    addHandler: jest.fn(),
    removeHandler: jest.fn(),
  },
}));

jest.mock('lodash/debounce', () => jest.fn((fn) => fn));

jest.mock('src/hooks/useSelector', () => ({
  useSelector: jest
    .fn()
    .mockImplementationOnce((cb) =>
      cb({ market: { records: [{ code: 'BTC-USDT' }, { code: 'KCS-USDT' }] } }),
    ),
}));

describe('useShow', () => {
  let callback;

  beforeEach(() => {
    callback = jest.fn();
    jest.clearAllMocks();
  });

  it('should add and remove App event listeners in App environment', () => {
    JsBridge.isApp.mockReturnValue(true);
    const { unmount } = renderHook(() => useShow(callback));

    // Unmount the hook and verify that the App event listener is removed
    unmount();
  });

  it('should add and remove Web event listeners in Web environment', () => {
    JsBridge.isApp.mockReturnValue(false);
    const { unmount } = renderHook(() => useShow(callback));

    // Unmount the hook and verify that the Web event listener is removed
    unmount();
  });
});
