/**
 * Owner: garuda@kupotech.com
 * 引导调整风险限额弹框
 */
import React from 'react';

import { useRiskLimitProps } from './hooks';

import { DialogInfo, Alert } from './style';

import { thousandPointed, _t } from '../../../builtinCommon';

import OrderConfirm from '../OrderConfirm';

const RiskLimitOrderDialog = ({ onOk }) => {
  const { riskLimitOrderInfo, riskLimitLevelInfo } = useRiskLimitProps();

  return (
    <>
      <DialogInfo>
        <Alert
          className="alert-info"
          showIcon
          type="success"
          title={_t('risk.limit.successTips', {
            maxRiskLimit: thousandPointed(riskLimitLevelInfo?.maxRiskLimit || 0),
            currency: riskLimitLevelInfo?.settleCurrency,
          })}
        />
        <OrderConfirm values={riskLimitOrderInfo} showPreferences={false} onOk={onOk} />
      </DialogInfo>
    </>
  );
};

export default React.memo(RiskLimitOrderDialog);
