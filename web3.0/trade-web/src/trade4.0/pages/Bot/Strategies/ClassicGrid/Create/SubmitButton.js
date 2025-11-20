/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useRef, useEffect } from 'react';
import OrderSureSheet from './OrderSureSheet';
// import { couponSubmitCheck } from 'strategies/components/Coupon/util';
import useStateRef from '@/hooks/common/useStateRef';
import SubmitButton from 'Bot/components/Common/SubmitButton';
import { Button, useSnackbar } from '@kux/mui';
import { trackClick, gaExpose } from 'src/utils/ga';
import { _t } from 'Bot/utils/lang';
import { useModel } from './model';

export default React.memo(({ form, setInProp, type, clearCoupon }) => {
  const { clearForm } = useModel();
  const dialogRef = useRef();
  const { message } = useSnackbar();
  const setInPropHandlerRef = useStateRef(async (_) => {
    // 点击运行埋点
    trackClick(['confirmCreate', '2'], {
      clickPosition: 'confirm',
      resultType: 'spotGrid',
      yesOrNo: !!setInProp?.options.coupon,
      type,
    });
    let values = {};
    try {
      values = await form.validateFields();
    } catch (error) {
      console.log(error);
      return;
    }

    const { levelPrice, gridLevels, coupon, inverst, symbol, stra, openUnitPrice } =
      setInProp.options;
    // 检查diff是否为0 的情况
    if (levelPrice <= 0 && gridLevels.length === 0) {
      return message.error(_t('clsgrid.validparams'));
    }
    // if (coupon) {
    //   setLoading(true);
    //   // 校验投资额 交易对 和卡券的规则
    //   const valid = await couponSubmitCheck({ stra, symbol, inverst, coupon }, () => {
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
    //   // 卡券和触发开单价不能同时设置
    //   if (openUnitPrice) {
    //     return message.error(_t('cannotsetboth'));
    //   }
    // }

    dialogRef.current.toggle();
    gaExpose(['confirmCreate', '1'], {
      resultType: 'spotGrid',
      yesOrNo: !!coupon,
      type,
    });
  });
  const onSuccess = () => {
    clearForm(form);
  };

  // 运行曝光埋点
  useEffect(() => {
    gaExpose(['confirmCreate', '2'], {
      resultType: 'spotGrid',
      yesOrNo: !!setInProp?.options.coupon,
      type,
    });
  }, []);

  return (
    <>
      <SubmitButton onClick={setInPropHandlerRef.current} />

      <OrderSureSheet dialogRef={dialogRef} setInProp={setInProp} onSuccess={onSuccess} />
    </>
  );
});
