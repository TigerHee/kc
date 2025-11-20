/**
 * Owner: garuda@kupotech.com
 * 调整真实杠杆-杠杆限制
 */
import React, { useCallback } from 'react';

import { trackClick } from 'src/utils/ga';
import { ADJUST_LEVERAGE } from '@/meta/futuresSensors/withdraw';

import { _t } from 'utils/lang';

import Tooltip from '@mui/Tooltip';

import { CurrentBox } from './style';

const LimitLeverage = ({ minLeverage, maxLeverage, disabled, isFocus }) => {

  // 埋点
  const handleClose = useCallback(() => {
    trackClick([ADJUST_LEVERAGE, '5']);
  }, []);

  return (
    <>
      <CurrentBox isFocus={isFocus}>
        <Tooltip
          placement="top"
          title={_t('operator.realLeverage.tips')}
          modalTitle={_t('adjust.position.leverage')}
          onClose={handleClose}
        >
          <span className="lean-more">
            {disabled
              ? _t('leverage.not.change')
              : _t('limit.leverage', { min: minLeverage, max: maxLeverage })}
          </span>
        </Tooltip>
      </CurrentBox>
    </>
  );
};

export default React.memo(LimitLeverage);
