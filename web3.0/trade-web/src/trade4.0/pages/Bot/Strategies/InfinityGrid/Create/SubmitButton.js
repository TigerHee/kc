/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'dva';
import OrderSureSheet from './OrderSureSheet';
// import { couponSubmitCheck } from 'strategies/components/Coupon/util';
import useStateRef from '@/hooks/common/useStateRef';
import SubmitButton from 'Bot/components/Common/SubmitButton';
import { Button, useSnackbar } from '@kux/mui';
import { trackClick, gaExpose } from 'src/utils/ga';
import { _t } from 'Bot/utils/lang';
import { useModel } from './model';

export default React.memo(({ form, allSubmitParams, type, clearCoupon }) => {
  const { clearForm } = useModel();
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef();
  const { message } = useSnackbar();
  const setInPropHandlerRef = useStateRef(async (_) => {
    // 点击运行埋点
    trackClick(['confirmCreate', '2'], {
      clickPosition: 'confirm',
      resultType: 'infinity',
      yesOrNo: !!allSubmitParams?.coupon,
      type,
    });
    let values = {};
    try {
      values = await form.validateFields();
      const { stra, symbol, limitAsset, coupon } = allSubmitParams;
      // if (coupon) {
      //   setLoading(true);
      //   // 校验投资额 交易对 和卡券的规则
      //   const valid = await couponSubmitCheck({ stra, symbol, inverst: limitAsset, coupon }, () => {
      //     // 清空卡券数据
      //     clearCoupon(null);
      //     setTimeout(() => {
      //       // 再次发起校验提交
      //       setInPropHandlerRef.current();
      //     }, 50);
      //   });
      //   setLoading(false);
      //   if (!valid) {
      //     return;
      //   }
      // }
      dialogRef.current.toggle();
      gaExpose(['confirmCreate', '1'], {
        resultType: 'infinity',
        yesOrNo: !!coupon,
        type,
      });
    } catch (error) {
      console.log(error);
    }
  });

  // 运行曝光埋点
  useEffect(() => {
    gaExpose(['confirmCreate', '2'], {
      resultType: 'infinity',
      yesOrNo: !!allSubmitParams?.coupon,
      type,
    });
  }, []);
  const onSuccess = () => {
    clearForm(form);
  };
  return (
    <>
      <SubmitButton onClick={setInPropHandlerRef.current} />

      <OrderSureSheet
        dialogRef={dialogRef}
        allSubmitParams={allSubmitParams}
        onSuccess={onSuccess}
      />
    </>
  );
});
