import moment from 'moment';

import { autoFormmatPeriod } from 'src/components/V3ExportDrawer/TaxInvoiceDrawer';

describe('getInitTime', () => {
  //   it('should return October 1 to yesterday for TH site before October 31, 2024', () => {
  //     window._BRAND_SITE_ = 'TH';
  //     jest.spyOn(moment(), 'isBefore').mockReturnValue(true);
  //     const result = getInitTime();
  //     expect(result[0].isSame(moment('2024/10/01'))).toBe(true);
  //     expect(result[1].isSame(moment().subtract(1, 'days').endOf('days'))).toBe(true);
  //   });
  //   it('should return last 30 days for TH site after October 31, 2024', () => {
  //     window._BRAND_SITE_ = 'TH';
  //     jest.spyOn(moment(), 'isBefore').mockReturnValue(false);
  //   });
  //   it('should return last month for other sites', () => {
  //     window._BRAND_SITE_ = 'KC';
  //     const result = getInitTime();
  //     expect(
  //       result[0].isSame(moment().subtract(1, 'days').subtract(1, 'month').startOf('days')),
  //     ).toBe(true);
  //     expect(result[1].isSame(moment().subtract(1, 'days').endOf('days'))).toBe(true);
  //   });
});

// describe('disabledDate', () => {
//   //   it('should disable dates outside the range from 2017-09-16 to yesterday', () => {
//   //     window._BRAND_SITE_ = 'KC';
//   //     const minDate = moment(1505520000000); // 2017-09-16
//   //     expect(disabledDate(minDate.subtract(1, 'days'))).toBe(true);
//   //     expect(disabledDate(moment().subtract(1, 'days').add(1, 'days'))).toBe(true);
//   //     expect(disabledDate(minDate)).toBe(false);
//   //   });

//   it('should disable dates outside the 12-month range if values are selected', () => {
//     const selectedDate = moment('2024/10/01');
//     const values = { current: [selectedDate] };
//     expect(disabledDate(moment('2023/10/01'), values)).toBe(false);
//     expect(disabledDate(moment('2022/09/01'), values)).toBe(true);
//     expect(disabledDate(moment('2025/10/01'), values)).toBe(true);
//   });
// });

// describe('disabledDateTH', () => {
//   it('should return true if date is out of range (before 2024-10-01 or after yesterday)', () => {
//     const dateBefore = moment('2024/09/30');
//     const dateAfter = moment().add(1, 'days');
//     expect(disabledDateTH(dateBefore)).toBe(true);
//     expect(disabledDateTH(dateAfter)).toBe(true);
//   });

//   it('should return false if date is within range and within the selected month difference', () => {
//     const current = moment('2024/10/01');
//     const values = { current: [moment('2024/10/01')] };
//     expect(disabledDateTH(current, values)).toBe(false);
//   });

//   it('should return true if date is outside the selected month difference', () => {
//     const current = moment('2024/08/01');
//     const values = { current: [moment('2024/10/01')] };
//     expect(disabledDateTH(current, values)).toBe(true);
//   });
// });

// describe('checkIsOverTwoYears', () => {
//   it('should return true if the timestamp is more than two years old', () => {
//     const timestamp = moment().subtract(3, 'years').valueOf();
//     expect(checkIsOverTwoYears(timestamp)).toBe(true);
//   });

//   it('should return false if the timestamp is within the last two years', () => {
//     const timestamp = moment().subtract(1, 'year').valueOf();
//     expect(checkIsOverTwoYears(timestamp)).toBe(false);
//   });
// });

describe('autoFormmatPeriod', () => {
  it('should adjust the period if the start date is before the minimum date', () => {
    const period = [moment('2024/09/01'), moment('2024/10/15')];
    const result = autoFormmatPeriod(period);
    expect(result[0].isSame(moment('2024/10/01'))).toBe(true);
  });

  it('should adjust the period if the end date is after the maximum date', () => {
    const period = [moment('2024/10/05'), moment().add(1, 'days')];
    const result = autoFormmatPeriod(period);
    expect(result[1].isSame(moment().subtract(1, 'days').endOf('days'))).toBe(true);
  });

  it('should return the same period if within range', () => {
    const period = [moment('2024/10/05'), moment('2024/10/10')];
    const result = autoFormmatPeriod(period);
    expect(result[0].isSame(period[0])).toBe(true);
    expect(result[1].isSame(period[1])).toBe(true);
  });
});
