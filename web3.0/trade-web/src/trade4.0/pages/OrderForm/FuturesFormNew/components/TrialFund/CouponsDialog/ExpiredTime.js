/**
 * Owner: garuda@kupotech.com
 */
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { _t, styled, intlFormatDate } from '../../../builtinCommon';

const ExpiredTimeBox = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
  .emphasis {
    color: ${(props) => props.theme.colors.complementary};
  }
`;
/**
 * @name ExpiredTime
 * @description 过期时间显示组件 (八小时内显示XX小时后过期，八小时外显示具体时间)
 * @param {Props}
 * @returns {ReactNode}
 */

const ExpiredTime = ({ time }) => {
  const now = useSelector((state) => state.server_time.serverTime);

  const isNotDate = time - now < 28800000; // 8 * 60 * 60 * 1000;

  // 日期
  const dateStr = useMemo(() => {
    if (isNotDate) {
      return Math.ceil((time - now) / (60 * 60 * 1000));
    } else {
      return intlFormatDate({ date: time, format: 'YYYY/MM/DD HH:mm' });
    }
  }, [time, now, isNotDate]);

  const intlText = useMemo(() => {
    return isNotDate ? 'trial2.time.expried.hour' : 'trial2.time.expried';
  }, [isNotDate]);

  return (
    <ExpiredTimeBox>
      <span className={isNotDate ? 'emphasis' : ''}>{_t(intlText, { date: dateStr })}</span>
    </ExpiredTimeBox>
  );
};

export default React.memo(ExpiredTime);
