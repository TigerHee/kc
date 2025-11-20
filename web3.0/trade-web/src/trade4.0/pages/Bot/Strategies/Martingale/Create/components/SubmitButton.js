/**
 * Owner: mike@kupotech.com
 */
import React, { useRef, useEffect } from 'react';
import OrderSureSheet from './OrderSureSheet';
import useStateRef from '@/hooks/common/useStateRef';
// import { couponSubmitCheck } from 'strategies/components/Coupon/util';
import { useModel } from '../model.js';
import { validator } from './InputSheet';
import { trackClick, gaExpose } from 'src/utils/ga';
import { _t, _tHTML } from 'Bot/utils/lang';
import SubmitButton from 'Bot/components/Common/SubmitButton';

export default React.memo(({ type = 'auto' }) => {
  const { form, formData, setMergeState, setCoupon } = useModel();
  const sheetRef = useRef();
  const setInPropHandlerRef = useStateRef(async (_) => {
    // 点击运行埋点
    trackClick(['confirmCreate', '2'], {
      clickPosition: 'confirm',
      resultType: 'martingale',
      yesOrNo: false,
      type,
    });
    try {
      const values = await form.validateFields();
      validator({ setMergeState, formData }).then(() => {
        // if (formData.coupon) {
        //   // 校验投资额 交易对 和卡券的规则
        //   const valid = await couponSubmitCheck(
        //     {
        //       stra: formData.stra,
        //       symbol: formData.symbol,
        //       inverst: formData.limitAsset,
        //       coupon: formData.coupon
        //     },
        //     function couponNotUseCallback() {
        //       // 清空卡券数据
        //       setCoupon(null);
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
        //   if (formData.openUnitPrice) {
        //     return message.error(_t('cannotsetboth'));
        //   }
        // }
        sheetRef.current.toggle();
        gaExpose(['confirmCreate', '1'], {
          resultType: 'martingale',
          yesOrNo: false,
          type,
        });
      });
    } catch (error) {
      console.log(error);
    }
  });
  return (
    <>
      <SubmitButton
        mb={16}
        mt={12}
        variant="contained"
        fullWidth
        onClick={setInPropHandlerRef.current}
      >
        {_t('gridwidget11')}
      </SubmitButton>
      <OrderSureSheet sheetRef={sheetRef} />
    </>
  );
});
