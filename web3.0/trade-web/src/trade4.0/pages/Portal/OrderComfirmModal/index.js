/**
 * Owner: borden@kupotech.com
 */
import React, { memo, useCallback } from 'react';
import { useSelector } from 'dva';
import { _t } from 'utils/lang';
import Dialog from '@mui/Dialog';

/**
 * OrderComfirmModal
 * 提单提示 弹窗
 */
const OrderComfirmModal = (props) => {
  const { onOk, ...restProps } = props;
  const formValues = useSelector((state) => state.tradeForm.formValues);
  const { vals, side } = formValues || {};

  const handleOk = useCallback(() => {
    if (onOk) onOk({ values: vals, side });
  }, [onOk, vals, side]);

  return (
    <Dialog
      {...restProps}
      onOk={handleOk}
      okText={_t('qvgiVS5T7RKxyFuqRmu4ab')}
      cancelText={_t('iJEAADBXMQmhnNCKgopjxx')}
      title={<span>{_t('9HixxHMDsaWwwh5sC486ew')}</span>}
    >
      {_t('bpFvu2QFqU57mxvenuaJQq')}
    </Dialog>
  );
};

export default memo(OrderComfirmModal);
