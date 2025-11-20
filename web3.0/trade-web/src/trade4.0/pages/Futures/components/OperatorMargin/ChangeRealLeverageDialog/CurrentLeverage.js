/**
 * Owner: garuda@kupotech.com
 * 调整真实杠杆-当前杠杆
 */
import React from 'react';

import { _t } from 'utils/lang';

import { formatNumber } from '@/utils/futures';

import { CurrentBox, TooltipClx } from './style';

const CurrentLeverage = ({ realLeverage }) => {
  return (
    <>
      <TooltipClx useUnderline={false} title={_t('futures.leverage.adjust.desc')}>
        <CurrentBox value={realLeverage}>
          <span>{_t('current.leverage')}</span>
          <span className="value">
            {realLeverage ? `${formatNumber(realLeverage, { dropZ: false, fixed: 2 })}x` : '-'}
          </span>
        </CurrentBox>
      </TooltipClx>
    </>
  );
};

export default React.memo(CurrentLeverage);
