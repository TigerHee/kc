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

export default React.memo(({ form, setInProp, type, clearCoupon }) => {
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef();
  const { message } = useSnackbar();
  const setInPropHandlerRef = useStateRef(async (_) => {
    // 点击运行埋点
    trackClick(['confirmCreate', '2'], {
      clickPosition: 'confirm',
      resultType: 'SPOT_AI_GRID',
      yesOrNo: !!setInProp?.coupon,
      type,
    });
    let values = {};
    try {
      values = await form.validateFields();
      const { coupon, limitAsset, symbol, stra } = setInProp;

      dialogRef.current.toggle();
      gaExpose(['confirmCreate', '1'], {
        resultType: 'SPOT_AI_GRID',
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

      <OrderSureSheet dialogRef={dialogRef} setInProp={setInProp} onSuccess={onSuccess} />
    </>
  );
});
