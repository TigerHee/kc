/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useRef } from 'react';
import OrderSureSheet from './OrderSureSheet';
import useStateRef from '@/hooks/common/useStateRef';
import SubmitButton from 'Bot/components/Common/SubmitButton';
import { useSnackbar } from '@kux/mui';
import { trackClick, gaExpose } from 'src/utils/ga';
import { _t } from 'Bot/utils/lang';
import DialogRef from 'Bot/components/Common/DialogRef';
import Storage from 'utils/storage';

const showRiskDialog = () => {
  return new Promise((r, j) => {
    DialogRef.info({
      title: _t('futrgrid.riskhint'),
      content: <div>{_t('aispottrend.riskcont')}</div>,
      cancelText: _t('machinecopydialog7'),
      okText: _t('gridwidget6'),
      onCancel: j,
      onOk: r,
    });
  });
};

const riskCacheKey = 'bot.spot.cta.risk.dialog';

export default React.memo(({ form, options, type, clearCoupon }) => {
  const dialogRef = useRef();
  const { message } = useSnackbar();
  const setInPropHandlerRef = useStateRef(async (_) => {
    // 点击运行埋点
    trackClick(['confirmCreate', '2'], {
      clickPosition: 'confirm',
      resultType: options.stra,
      yesOrNo: !!options?.coupon,
      type,
    });
    let values = {};
    try {
      values = await form.validateFields();
      const { coupon, limitAsset, symbol, stra } = options;
      // 风险提示
      if (!Storage.getItem(riskCacheKey)) {
        return showRiskDialog()
          .then(() => {
            Storage.setItem(riskCacheKey, 1);
            setInPropHandlerRef.current();
          })
          .catch(() => {});
      }
      dialogRef.current.toggle();
      gaExpose(['confirmCreate', '1'], {
        resultType: options.stra,
        yesOrNo: !!coupon,
        type,
      });
    } catch (error) {
      console.log(error);
    }
  });
  const onSuccess = () => {
    form.resetFields();
  };

  return (
    <>
      <SubmitButton onClick={setInPropHandlerRef.current} />

      <OrderSureSheet dialogRef={dialogRef} setInProp={options} onSuccess={onSuccess} />
    </>
  );
});
