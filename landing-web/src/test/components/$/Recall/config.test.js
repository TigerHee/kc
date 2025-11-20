/*
 * Owner: tom@kupotech.com
 */
import { recallStageStatus, recallStageTimeUnit, formatNumber } from 'components/$/Recall/config';

describe('Recall config', () => {
  test('recallStageStatus', () => {
    expect(recallStageStatus.WAIT_DRAW).toBe(3);
  });

  test('recallStageTimeUnit', () => {
    expect(recallStageTimeUnit.MILLISECONDS).toBe(1);
  });

  test('formatNumber', () => {
    expect(formatNumber('123')).toBe('123');
    expect(formatNumber(0)).toBe('0');

    expect(formatNumber(1234567.1234, false)).toBe('1234567');
    expect(formatNumber(1234567.1234)).toBe('1,234,567');

    expect(formatNumber(1234.12345678, false)).toBe('1234.1234');
    expect(formatNumber(1234.12345678)).toBe('1,234.1234');

    expect(formatNumber(234.1, false)).toBe('234.1');
    expect(formatNumber(234.1)).toBe('234.1');

    expect(formatNumber(234.1234578, false)).toBe('234.12345');
    expect(formatNumber(234.1234578)).toBe('234.12345');
  });
});
