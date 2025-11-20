import { getCssEnvRealValue } from '@/common/get-css-env';

describe('getCssEnvRealValue', () => {
  let getComputedStyleSpy: jest.SpyInstance;

  beforeEach(() => {
    getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle');
  });

  afterEach(() => {
    getComputedStyleSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('returns correct value, fallback, and cache', () => {
    // Normal value
    getComputedStyleSpy.mockImplementation(() => ({ width: '42px' }) as any);
    expect(getCssEnvRealValue('safe-area-inset-bottom', 10)).toBe(42);

    // blank value
    getComputedStyleSpy.mockImplementation(() => ({ width: '' }) as any);
    expect(getCssEnvRealValue('safe-area-inset-top', 5)).toBe(5);

    // Cache branch
    getComputedStyleSpy.mockImplementation(() => ({ width: '123px' }) as any);
    expect(getCssEnvRealValue('safe-area-inset-right', 0)).toBe(123);
    getComputedStyleSpy.mockImplementation(() => ({ width: '999px' }) as any);
    expect(getCssEnvRealValue('safe-area-inset-right', 0)).toBe(123);
  });

  it('returns fallback when document.body is missing', () => {
    const originalBody = document.body;
    Object.defineProperty(document, 'body', {
      value: null,
      writable: true,
    });
    expect(getCssEnvRealValue('safe-area-inset-left', 7)).toBe(7);
    Object.defineProperty(document, 'body', {
      value: originalBody,
      writable: true,
    });
  });
});
