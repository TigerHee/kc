/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useRef, useEffect } from 'react';
import { Button, useSnackbar } from '@kux/mui';
import { useSelector } from 'dva';
import OrderSureSheet from './OrderSureSheet';
// import { couponSubmitCheck } from 'strategies/components/Coupon/util';
import useStateRef from '@/hooks/common/useStateRef';
import { _t } from 'Bot/utils/lang';
import { trackClick, gaExpose } from 'src/utils/ga';
import SubmitButton from 'Bot/components/Common/SubmitButton';

const SubmitButtonLogic = React.memo(({ allFormData, form, clearCoupon, type = 'auto' }) => {
  const [loading, setLoading] = useState(false);
  const isLogin = useSelector((state) => state.user.isLogin);
  const dialogRef = useRef();
  const { message } = useSnackbar();

  const setInPropHandlerRef = useStateRef(async (_) => {
    // 点击运行埋点
    trackClick(['confirmCreate', '2'], {
      clickPosition: 'confirm',
      resultType: 'DCA',
      yesOrNo: !!allFormData?.coupon,
      type,
    });
    let values = {};
    try {
      values = await form.validateFields();
    } catch (error) {
      return;
    }

    const { coupon, amount: inverst, symbol, stra } = allFormData;
    if (values.maxTotalCost && +values.maxTotalCost < +values.amount) {
      return message.error(_t('auto.investuplimitovereverycheck'));
    }
    // if (coupon) {
    //   setLoading(true);
    //   // 校验投资额 交易对 和卡券的规则
    //   const valid = await couponSubmitCheck(
    //     { stra, symbol, inverst, coupon },
    //     function couponNotUseCallback() {
    //       // 清空卡券数据
    //       clearCoupon(null);
    //       setTimeout(() => {
    //         // 再次发起校验提交
    //         setInPropHandlerRef.current();
    //       }, 50);
    //     }
    //   );
    //   setLoading(false);
    //   if (!valid) {
    //     return;
    //   }
    // }

    dialogRef.current.toggle();
    gaExpose(['confirmCreate', '1'], {
      resultType: 'DCA',
      yesOrNo: !!coupon,
      type,
    });
  });

  const onSuccess = () => {
    form.resetFields();
  };

  // 运行曝光埋点
  useEffect(() => {
    if (isLogin) {
      gaExpose(['confirmCreate', '2'], {
        resultType: 'DCA',
        yesOrNo: !!allFormData?.coupon,
        type,
      });
    }
  }, [allFormData.coupon, isLogin, type]);
  return (
    <>
      <SubmitButton onClick={setInPropHandlerRef.current} loading={loading} />
      <OrderSureSheet dialogRef={dialogRef} allFormData={allFormData} onSuccess={onSuccess} />
    </>
  );
});

export default SubmitButtonLogic;
