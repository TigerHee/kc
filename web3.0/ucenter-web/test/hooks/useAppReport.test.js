/**
 * Owner: willen@kupotech.com
 */
import { default as useAppReport } from 'src/hooks/useAppReport';
import { renderHook } from '@testing-library/react-hooks';
import _ from 'lodash';
import Report from 'tools/ext/kc-report';

jest.mock('lodash', () => ({
  delay: jest.fn((fn, time) => {
    setTimeout(fn, 0);
    return fn;
  }),
}));

jest.mock('tools/ext/kc-report', () => ({
  logWebNetwork: jest.fn(),
  logSelfDefined: jest.fn(),
}));

describe('useAppReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('应该在组件挂载后延迟调用 logWebNetwork', () => {
    renderHook(useAppReport);
    
    expect(_.delay).toHaveBeenCalledWith(Report.logWebNetwork, 3000);
    jest.runAllTimers();
    expect(Report.logWebNetwork).toHaveBeenCalled();
  });

  it('当存在 referrer 时应该调用 logSelfDefined', () => {
    const testReferrer = 'https://www.kucoin.com';
    Object.defineProperty(document, 'referrer', {
      value: testReferrer,
      configurable: true,
    });

    renderHook(useAppReport);
    
    expect(Report.logSelfDefined).toHaveBeenCalledWith('page-referrer', testReferrer);
  });

  it('当不存在 referrer 时不应该调用 logSelfDefined', () => {
    Object.defineProperty(document, 'referrer', { 
      value: '',
      configurable: true 
    });

    renderHook(useAppReport);
    
    expect(Report.logSelfDefined).not.toHaveBeenCalled();
  });

  it('应该只在组件挂载时执行一次', () => {
    const { rerender } = renderHook(useAppReport);

    expect(_.delay).toHaveBeenCalledTimes(1);
    
    rerender();
    
    expect(_.delay).toHaveBeenCalledTimes(1);
  });
});
