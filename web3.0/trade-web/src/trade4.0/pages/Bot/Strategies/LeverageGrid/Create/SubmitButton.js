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
// import Storage from 'src/utils/storage';

export default React.memo(({ form, options, clearCoupon, type = 'auto' }) => {
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef();
  const { message } = useSnackbar();
  const setInPropHandlerRef = useStateRef(async (_) => {
    // 点击运行埋点
    trackClick(['confirmCreate', '2'], {
      clickPosition: 'confirm',
      resultType: 'MARGIN_GRID',
      yesOrNo: !!options?.coupon,
      type,
    });
    let values = {};
    try {
      values = await form.validateFields();
      const { coupon, openUnitPrice, stra, symbolCode, limitAsset } = options;
      // if (coupon) {
      //   // 校验投资额 交易对 和卡券的规则
      //   const valid = await couponSubmitCheck(
      //     { stra, symbol: symbolCode, inverst: limitAsset, coupon },
      //     function couponNotUseCallback() {
      //       // 清空卡券数据
      //       clearCoupon(null);
      //       setTimeout(() => {
      //         // 再次发起校验提交
      //         setInPropHandlerRef.current();
      //       }, 50);
      //     }
      //   );
      //   if (!valid) {
      //     return;
      //   }

      //   // 卡券和触发开单价不能同时设置
      //   if (openUnitPrice) {
      //     return message.error(_t('cannotsetboth'));
      //   }
      // }

      dialogRef.current.toggle();
    } catch (error) {
      console.log(error);
    }
  });
  const { clearForm } = useModel();
  const onSuccess = () => {
    clearForm(form);
  };

  // 运行曝光埋点
  useEffect(() => {
    gaExpose(['confirmCreate', '2'], {
      resultType: 'MARGIN_GRID',
      yesOrNo: !!options?.coupon,
      type,
    });
  }, []);

  return (
    <>
      <SubmitButton onClick={setInPropHandlerRef.current} direction={options.direction} />

      <OrderSureSheet dialogRef={dialogRef} options={options} onSuccess={onSuccess} />
    </>
  );
});
