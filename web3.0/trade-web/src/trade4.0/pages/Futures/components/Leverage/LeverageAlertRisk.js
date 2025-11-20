/**
 * Owner: garuda@kupotech.com
 * 杠杆过高，风险提示
 */
import React from 'react';
import { useSelector } from 'react-redux';

import { toPercent } from 'helper';

import { _t } from '@/pages/Futures/import';

import { KuxAlertRisk, KuxAlertWrapper } from './commonStyle';

const LeverageAlertRisk = ({ leverage, open }) => {
  const isLogin = useSelector((state) => state.user.isLogin);

  if (!isLogin || !open) return null;

  return (
    <KuxAlertWrapper>
      {leverage >= 10 && leverage <= 20 ? (
        <KuxAlertRisk title={<span>{_t('guide.lev.more10x')}</span>} showIcon type="warning" />
      ) : null}
      {leverage > 20 ? (
        <KuxAlertRisk
          title={
            <span>
              {_t('guide.lev.more20x', {
                percentage: toPercent(1 / leverage, 2, false, undefined, false, true),
              })}
            </span>
          }
          showIcon
          type="warning"
        />
      ) : null}
    </KuxAlertWrapper>
  );
};

export default React.memo(LeverageAlertRisk);
