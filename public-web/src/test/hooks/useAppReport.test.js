/**
 * Owner: jessie@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import Report from 'tools/ext/kc-report';
const { default: useAppReport } = require('src/hooks/useAppReport');

jest.mock('lodash', () => ({
  delay: jest.fn(),
}));

jest.mock('tools/ext/kc-report', () => ({
  logWebNetwork: jest.fn(),
  logSelfDefined: jest.fn(),
}));

describe('useAppReport hook', () => {
  it('delays logWebNetwork and not logs referrer', () => {
    // Mock document.referrer
    Object.defineProperty(document, 'referrer', {
      value: undefined,
      writable: true,
    });

    renderHook(useAppReport);

    expect(Report.logSelfDefined).not.toBeCalled();
  });

  it('delays logWebNetwork and logs referrer if it exists', () => {
    // Mock document.referrer
    Object.defineProperty(document, 'referrer', {
      value: 'test-referrer',
      writable: true,
    });

    renderHook(useAppReport);

    expect(Report.logSelfDefined).toHaveBeenCalledWith('page-referrer', 'test-referrer');
  });
});
