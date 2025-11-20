/**
 * Owner: garuda@kupotech.com
 * 风险限额过低提示
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Dialog from '@mui/Dialog';

import { _t } from '../../builtinCommon';

const RiskLimitLowDialog = () => {
  const dispatch = useDispatch();

  const showLowQuota = useSelector((state) => state.futuresForm.showLowQuota);

  const handleCloseDialog = () => {
    dispatch({ type: 'futuresForm/update', payload: { showLowQuota: false } });
  };

  const handleSubmit = () => {
    dispatch({
      type: 'futuresForm/update',
      payload: {
        showLowQuota: false,
      },
    });
    dispatch({
      type: 'futuresForm/update',
      payload: {
        onlyRiskLimitChangeVisible: true,
      },
    });
  };

  return (
    <Dialog
      title={_t('risk.limit.low.title')}
      open={showLowQuota}
      onCancel={handleCloseDialog}
      onOk={handleSubmit}
      okText={_t('risk.limit.low.btn')}
      cancelText={_t('cancel')}
    >
      <div className="dialog-content">{_t('risk.limit.low.content')}</div>
    </Dialog>
  );
};

export default React.memo(RiskLimitLowDialog);
