import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { renderWithHook } from '_tests_/test-setup';
import moment from 'moment';
import {
  useIntlFormatNumber,
  useIntlFormatDate,
  intlFormatNumber,
  intlFormatDate,
} from 'src/trade4.0/hooks/common/useIntlFormat.js';

afterEach(cleanup);

describe('useIntlFormat hooks', () => {
  it('test useIntlFormatNumber', () => {
    const { result } = renderWithHook(() => useIntlFormatNumber({ lang: 'en_US', number: 1 }));
    expect(result.current).toEqual('1');
  });

  it('test useIntlFormatDate', () => {
    const { result } = renderWithHook(() =>
      useIntlFormatDate({ lang: 'en_US', date: 1703604845048, options: {
        timeZone: 'Europe/London'
      } }),
    );
    expect(result.current).toEqual('12/26/2023 15:34:05');
  });

  it('test intlFormatNumber', () => {
    const { result } = renderWithHook(() => intlFormatNumber({ lang: 'en_US', number: 1 }));
    expect(result.current).toEqual('1');
  });

  it('test intlFormatDate', () => {
    const { result } = renderWithHook(() => intlFormatDate({ lang: 'en_US', date: 1703604845048, options: {
      timeZone: 'Europe/London'
    } }));
    expect(result.current).toEqual('12/26/2023 15:34:05');
  });
});