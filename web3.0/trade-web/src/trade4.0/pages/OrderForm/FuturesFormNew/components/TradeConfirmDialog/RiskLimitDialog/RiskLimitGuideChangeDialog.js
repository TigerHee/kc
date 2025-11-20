/**
 * Owner: garuda@kupotech.com
 * 引导调整风险限额弹框
 */
import React from 'react';

import { DialogInfo } from './style';

import { _t } from '../../../builtinCommon';

const RiskLimitGuideChangeDialog = () => {
  return (
    <>
      <DialogInfo>
        <div className="info">{_t('risk.limit.guideChange')}</div>
      </DialogInfo>
    </>
  );
};

export default React.memo(RiskLimitGuideChangeDialog);
