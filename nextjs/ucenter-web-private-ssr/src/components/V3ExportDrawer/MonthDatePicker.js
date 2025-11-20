/**
 * Owner: harry.lai@kupotech.com
 */
import { DatePicker, Global, styled } from '@kux/mui';
import { useMemoizedFn } from 'ahooks';
import moment from 'moment';
import { memo } from 'react';

export const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  .KuxPicker-suffix .ICTriangleBottom2_svg__icon {
    width: 16px;
    height: 16px;
  }
`;

export const datePickerGlobalStyle = `
 .KuxDatePicker-Dropdown {
    tbody tr:not(:first-of-type) {
      ${(props) => props.theme.breakpoints.down('sm')} {
        height: unset!important;
      }
      td {
        padding: 0px !important;
      }
    }
    tbody {
      td {
        padding: 0px !important;
      }
      tr {
        ${(props) => props.theme.breakpoints.down('sm')} {
          height: unset!important;
        }
      }
    }
  }

  .month-date-picker-popup {
    .KuxPicker-dropdown {
      min-width: 288px!important;
      width: 288px!important;
    }
  }
`;

const MAX_DATE = '2025-09-01';

/**
 * 自定义禁用：月结账单导出禁用日期
 * N 月1号 18:00  (UTC+0)之后,才可见N-1月选项
 * N 月1号 00:00-18:00 (UTC+0)之间,可见N-2月选项
 * @param {Date} date
 * @returns {boolean} 是否禁用
 */
export const monthStatementDateDisabled = (date) => {
  // 获取当前时间 (UTC+0)
  const now = moment().utcOffset('+00:00');

  const isFirstDayOfMonth = now.date() === 1;
  const isBeforeEightAM = now.hour() < 18;

  // 根据条件设置最大允许的月份
  let maxAllowed = now.clone().subtract(1, 'months').endOf('month'); // 最大允许：n-1月份
  if (isFirstDayOfMonth && isBeforeEightAM) {
    // 如果是每月1号的00:00-18:00之间，则最大允许为n-2个月
    maxAllowed = now.clone().subtract(2, 'months').endOf('month');
  }
  const minAllowed = maxAllowed.clone().subtract(12, 'months').endOf('month'); // 最小允许：12个月前

  // 获取目标日期所在月份的最后一天
  const targetMonth = moment(date).endOf('month');

  const specificCutoff = moment(MAX_DATE);

  // 判断是否在允许范围外（早于最小边界或晚于最大边界）或早于2025-09-01
  return (
    targetMonth.isBefore(minAllowed) ||
    targetMonth.isAfter(maxAllowed) ||
    targetMonth.isBefore(specificCutoff)
  );
};

/**
 * 生成月结账单选择器默认时间
 * desc: N 月1号 18:00  (UTC+0)之后,才可见N-1月选项N 月1号 00:00-18:00 am (UTC+7)之间,可见N-2月选项
 */
export const generateMonthPickerDefaultTime = () => {
  // 获取当前时间 (UTC+0)
  const now = moment().utcOffset('+00:00');

  const isFirstDayOfMonth = now.date() === 1;
  const isBeforeEightAM = now.hour() < 18;

  const canNotSelectLastMonth = isFirstDayOfMonth && isBeforeEightAM;

  return moment()
    .subtract(canNotSelectLastMonth ? 2 : 1, 'months')
    .format('YYYY-MM');
};

const MonthDatePicker = ({ onChange: propsOnChange, value: propsValue }) => {
  const onChange = useMemoizedFn((date) => {
    const data = moment(date).format('YYYY-MM');
    propsOnChange?.(data);
  });

  return (
    <>
      <Global styles={datePickerGlobalStyle} />
      <StyledDatePicker
        size="large"
        allowClear={false}
        disabledDate={monthStatementDateDisabled}
        picker="month"
        width={248}
        value={propsValue ? moment(propsValue) : null}
        onChange={onChange}
        format="MM/YYYY"
        popupClassName="month-date-picker-popup"
      />
    </>
  );
};

export const dayStatementDateDisabled = (current) => {
  const targetDay = moment(current);
  const now = moment();
  // 最小可选择的时间为一年前
  // 最大可选为昨天
  const maxDate = now.clone().subtract(1, 'days').endOf('day');
  const minDate = maxDate.clone().subtract(365, 'days').endOf('day');

  const specificCutoff = moment(MAX_DATE);

  // 判断是否在允许范围外（早于最小边界或晚于最大边界）或早于2025-09-01
  return (
    targetDay.isAfter(maxDate) || targetDay.isBefore(minDate) || targetDay.isBefore(specificCutoff)
  );
};

const DayDatePicker = ({ onChange: propsOnChange, value: propsValue }) => {
  const onChange = useMemoizedFn((date) => {
    const data = moment(date).format('YYYY/MM/DD');
    propsOnChange?.(data);
  });

  return (
    <>
      <Global styles={datePickerGlobalStyle} />
      <StyledDatePicker
        size="large"
        allowClear={false}
        disabledDate={dayStatementDateDisabled}
        width={248}
        value={propsValue ? moment(propsValue) : null}
        onChange={onChange}
        format="MM/DD/YYYY"
        popupClassName="day-date-picker-popup"
      />
    </>
  );
};
export { DayDatePicker };

export default memo(MonthDatePicker);
