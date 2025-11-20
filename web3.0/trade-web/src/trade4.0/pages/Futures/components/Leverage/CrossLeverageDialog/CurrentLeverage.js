/**
 * Owner: garuda@kupotech.com
 * 调整杠杆-当前杠杆
 */
import React from 'react';

import { ABC_CROSS_LEVERAGE } from '@/components/AbnormalBack/constant';
import { useShowAbnormal } from '@/components/AbnormalBack/hooks';

import { styled, formatNumber, _t } from '@/pages/Futures/import';

export const CurrentBox = styled.div`
  margin: 4px 0;
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
  .value {
    margin-left: 4px;
    font-weight: 500;
    color: ${(props) => (props.value ? props.theme.colors.text : props.theme.colors.text40)};
  }
  .lean-more {
    cursor: help;
    text-decoration: underline dashed ${(props) => props.theme.colors.text20};
    color: ${(props) =>
      (props.isFocus ? props.theme.colors.complementary : props.theme.colors.text40)};
  }
`;

const CurrentLeverage = ({ leverage }) => {
  const showAbnormal = useShowAbnormal();
  const abnormalResult = showAbnormal({
    requiredKeys: [ABC_CROSS_LEVERAGE],
  });

  return (
    <>
      <CurrentBox value={leverage}>
        <span>{_t('current.leverage')}</span>
        <span className="value">
          {abnormalResult ||
            (leverage ? `${formatNumber(leverage, { pointed: true, dropZ: false })}x` : '--')}
        </span>
      </CurrentBox>
    </>
  );
};

export default React.memo(CurrentLeverage);
