/**
 * Owner: garuda@kupotech.com
 * 合约下单组件模块入口
 */

import React, { memo } from 'react';

import loadable from '@loadable/component';

import VerifyWrapper from './components/VerifyWrapper';
import { VerifyContext } from './config';
import FuturesInit from './FormContent/FuturesInit';
import PluralForm from './FormContent/PluralForm';
import SingleForm from './FormContent/SingleForm';

import useTradePwdStatus from './hooks/useTradePwdStatus';
import useWrapperScreen from './hooks/useWrapperScreen';

// 合约余额不足弹框
const BalanceInsufficientDialog = loadable(() => {
  return import(
    /* webpackChunkName: 'trade-futuresModal' */ './components/BalanceInsufficientDialog'
  );
});

// 修改风险限额弹框
const RiskLimitChangeModal = loadable(() =>
  import(/* webpackChunkName: 'order-dialog-2' */ './components/RiskLimit/ChangeRiskLimitDialog'),
);

// 风险限额过低提示
const RiskLimitLowDialog = loadable(() =>
  import(/* webpackChunkName: 'order-dialog-2' */ './components/RiskLimit/RiskLimitLowDialog'),
);

// 没有激活体验金弹框
const NotActivatedDialog = loadable(() =>
  import(/* webpackChunkName: 'order-dialog-2' */ './components/TrialFund/NotActivatedDialog'),
);

// 体验金余额不足弹框
const TrialFundInsufficientDialog = loadable(() =>
  import(
    /* webpackChunkName: 'order-dialog-2' */ './components/TrialFund/TrialFundInsufficientDialog'
  ),
);

// 委托介绍弹框
const IntroduceDialog = loadable(() =>
  import(/* webpackChunkName: 'order-dialog-2' */ './components/Introduce/IntroModal'),
);

// 奖券弹框
const CouponsDialog = loadable(() =>
  import(/* webpackChunkName: 'coupons-dialog' */ './components/TrialFund/CouponsDialog'),
);

// 抵扣券规则弹框
const CouponRuleDrawer = loadable(() =>
  import(/* webpackChunkName: 'coupons-dialog' */ './components/TrialFund/CouponRuleDrawer'),
);

// 体验金规则弹框
const TrialFundRuleDrawer = loadable(() =>
  import(/* webpackChunkName: 'coupons-dialog' */ './components/TrialFund/TrialRuleDrawer'),
);

// 全仓引导
const CrossGuide = loadable(() => import(/* webpackChunkName: 'guide-dialog' */ './CrossGuide'));


const FuturesFormWrapper = () => {
  const tradePwdProps = useTradePwdStatus();
  const { isMd } = useWrapperScreen();

  return (
    <>
      <FuturesInit />
      <VerifyContext.Provider value={tradePwdProps}>
        <VerifyWrapper>{isMd ? <PluralForm /> : <SingleForm />}</VerifyWrapper>
        <BalanceInsufficientDialog />
        <RiskLimitLowDialog />
        <RiskLimitChangeModal />
        <NotActivatedDialog />
        <TrialFundInsufficientDialog />
        <CouponsDialog />
        <CouponRuleDrawer />
        <TrialFundRuleDrawer />
        <IntroduceDialog />
      </VerifyContext.Provider>
      <CrossGuide />
    </>
  );
};

export default memo(FuturesFormWrapper);
