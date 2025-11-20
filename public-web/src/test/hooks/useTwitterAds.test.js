/**
 * Owner: jessie@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
const { default: useTwitterAds } = require('src/hooks/useTwitterAds');

// Mock the loadScript module
jest.mock('utils/loadScript', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({}),
}));

describe('useTwitterAds hook', () => {
  it('test useTwitterAds', () => {
    renderHook(useTwitterAds);
  });

  it('test useTwitterAds return null', () => {
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: { userAgent: 'SSG_ENV' },
    });
    const { result } = renderHook(useTwitterAds);
    expect(result.current).toBeUndefined();
  });

  it('test useTwitterAds call window.twttr', () => {
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: { userAgent: '' },
    });
    Object.defineProperty(window, 'twttr', {
      writable: true,
      value: {
        conversion: {
          trackPid: jest.fn(),
        },
      },
    });
    const { result } = renderHook(useTwitterAds);
    expect(result.current).toBeUndefined();
  });
});
