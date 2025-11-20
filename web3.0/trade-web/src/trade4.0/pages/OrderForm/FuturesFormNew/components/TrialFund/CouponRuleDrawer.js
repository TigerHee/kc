/**
 * Owner: garuda@kupotech.com
 */
import React, { memo } from 'react';

import Divider from '@mui/Divider';

import { Drawer } from './commonStyle';

import { _t, dividedBy, intlFormatDate, toPercent } from '../../builtinCommon';
import { useCouponRuleInfo, useCouponRuleDialog } from '../../builtinHooks';

const Content = memo(() => {
  const { detailData } = useCouponRuleInfo();

  console.log('detailData --->', detailData);
  return (
    <div className="drawerContent">
      <div className={'topArea'}>
        <div className={'label'}>{_t('trial2.rulemodal.coupon.ratio')}</div>
        <div className={'value'}>
          {toPercent(dividedBy(detailData?.deductionRatio)(100))}
          <span className={'unit'}>{_t('trial2.coupon.discount')}</span>
        </div>
      </div>
      <Divider />
      <div className={'extraInfo'}>
        <div className={'item'}>
          <div className={'label'}>{_t('trial2.rulemodal.coupon.maxDiscount')}</div>
          <div className={'amount'}>{`${detailData?.faceValue} ${detailData?.currency}`}</div>
        </div>
        <div className={'item'}>
          <div className={'label'}>{_t('trial2.modal.replace.expired')}</div>
          <div className={'amount'}>
          {intlFormatDate({ date: detailData?.validPeriod, format: 'YYYY/MM/DD HH:mm' })}
          </div>
        </div>
      </div>
      <Divider />
      <div className={'rules'}>
        <p>{_t('trial2.rulemodal.coupon.rule.1')}</p>
        <p>{_t('trial2.rulemodal.coupon.rule.2')}</p>
        <p>{_t('trial2.rulemodal.coupon.rule.3')}</p>
      </div>
    </div>
  );
});

const CouponRuleDrawer = () => {
  const { modalState } = useCouponRuleInfo();
  const { closeModal } = useCouponRuleDialog();

  return (
    <Drawer
      back={false}
      show={modalState}
      title={_t('welfare.gift.coupon')}
      okText={_t('security.form.btn')}
      onClose={closeModal}
      onOk={closeModal}
      size="medium"
      anchor="right"
      cancelText={null}
      height="100vh"
      centeredFooterButton
    >
      <Content />
    </Drawer>
  );
};

export default memo(CouponRuleDrawer);
