import moment from 'moment';
import { getInitTime, disabledDate as disabledDateFn } from 'src/components/V3ExportDrawer/V3TimePicker';

// 仅测试导出的方法逻辑，避免渲染复杂依赖

describe('V3TimePicker helpers', () => {
  describe('getInitTime', () => {
    test('should return yesterday endOf day for single day', () => {
      const result = getInitTime(true);
      expect(moment.isMoment(result)).toBe(true);
      const expected = moment().subtract(1, 'days').endOf('days');
      expect(result.format('YYYY/MM/DD HH:mm:ss')).toBe(expected.format('YYYY/MM/DD HH:mm:ss'));
    });

    test('should return range [one month before yesterday startOf day, yesterday endOf day]', () => {
      const result = getInitTime(false);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      const [startAt, endAt] = result;
      const expectedStart = moment().subtract(1, 'days').subtract(1, 'month').startOf('days');
      const expectedEnd = moment().subtract(1, 'days').endOf('days');
      expect(startAt.format('YYYY/MM/DD HH:mm:ss')).toBe(expectedStart.format('YYYY/MM/DD HH:mm:ss'));
      expect(endAt.format('YYYY/MM/DD HH:mm:ss')).toBe(expectedEnd.format('YYYY/MM/DD HH:mm:ss'));
    });
  });

  describe('disabledDate', () => {
    test('should disable dates after yesterday', () => {
      const valuesRef = { current: [] };
      const today = moment();
      const result = disabledDateFn(today, valuesRef);
      expect(result).toBe(true);
    });

    test('should not disable yesterday', () => {
      const valuesRef = { current: [] };
      const yesterdayEnd = moment().subtract(1, 'days').endOf('day');
      const result = disabledDateFn(yesterdayEnd, valuesRef);
      expect(result).toBe(false);
    });

    test('should disable dates before min date (2017-09-16 00:00:00.000Z)', () => {
      const valuesRef = { current: [] };
      const beforeMin = moment(1505433600000); // 2017-09-15T00:00:00.000Z
      const result = disabledDateFn(beforeMin, valuesRef);
      expect(result).toBe(true);
    });

    test('should respect ±12 months window when a start date is selected', () => {
      const selected = moment('2022-06-15T00:00:00.000Z');
      const valuesRef = { current: [selected] };

      const minAllowed = moment(selected).subtract(12, 'months').startOf('days');
      const maxAllowed = moment(selected).add(12, 'months').endOf('days');

      expect(disabledDateFn(minAllowed, valuesRef)).toBe(false);
      expect(disabledDateFn(maxAllowed, valuesRef)).toBe(false);

      const beforeMin = moment(minAllowed).subtract(1, 'day');
      const afterMax = moment(maxAllowed).add(1, 'day');

      expect(disabledDateFn(beforeMin, valuesRef)).toBe(true);
      expect(disabledDateFn(afterMax, valuesRef)).toBe(true);
    });
  });
});
