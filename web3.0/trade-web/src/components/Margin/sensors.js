/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2022-03-28 16:34:03
 * @Description: 杠杆(全仓/逐仓)神策埋点配置
 */
import { trackClick, saTrackForBiz } from 'utils/ga';

// 公共埋点
export const commonSensors = {
  // 杠杆交易步骤
  marginStepTutorial: {
    transfer: {
      go: () => trackClick(['marginStepTutorial', '2']),
    },
    borrow: {
      go: () => trackClick(['marginStepTutorial', '3']),
      auto: () => trackClick(['marginStepTutorial', '4']),
    },
    repay: {
      go: () => trackClick(['marginStepTutorial', '5']),
      auto: () => trackClick(['marginStepTutorial', '6']),
    },
  },
  // 资产展示区
  assetDisplayArea: {
    transfer: () => trackClick(['assetDisplayArea', '1']),
    autoRepay: () => trackClick(['assetDisplayArea', '2']),
    borrow: () => trackClick(['assetDisplayArea', '3']),
    repay: () => trackClick(['assetDisplayArea', '4']),
  },
  // 划转弹窗
  transferWindow: {
    confirmBtn: {
      expose: () => saTrackForBiz({}, ['transferConfirm', '1']),
    },
    confirmSuccess: () => trackClick(['transferSuccess', '1']),
  },
  // 杠杆倍数修改弹窗
  leverageWindow: {
    confirmBtn: {
      expose: () => saTrackForBiz({}, ['multiConfirm', '1']),
    },
    confirmSuccess: () => trackClick(['multiSuccess', '1']),
  },
  // 借币还币弹窗
  borrowRepayWindow: {
    borrowConfirm: {
      click: () => trackClick(['borrowRepayWindow', '1']),
      expose: () => saTrackForBiz({}, ['borrowRepayWindow', '1']),
    },
    borrowSuccess: () => trackClick(['borrowSuccess', '1']),
    repayConfirm: {
      click: () => trackClick(['borrowRepayWindow', '2']),
      expose: () => saTrackForBiz({}, ['borrowRepayWindow', '2']),
    },
    repaySuccess: () => trackClick(['repaySuccess', '1']),
    RECENTLY_EXPIRE_FIRST: () => trackClick(['borrowRepayWindow', '3']),
    HIGHEST_RATE_FIRST: () => trackClick(['borrowRepayWindow', '4']),
    all: () => trackClick(['borrowRepayWindow', '5']),
    0.25: () => trackClick(['borrowRepayWindow', '6']),
    0.5: () => trackClick(['borrowRepayWindow', '7']),
    0.75: () => trackClick(['borrowRepayWindow', '8']),
    1: () => trackClick(['borrowRepayWindow', '9']),
  },
  // 开通杠杆交易
  openMarginAgreement: {
    open: () => trackClick(['openMarginAgreement', '1']),
    openConfirm: {
      click: () => trackClick(['openMarginAgreement', '2']),
      expose: () => saTrackForBiz({}, ['openMarginAgreement', '2']),
    },
    openMarginSuccess: () => trackClick(['openMarginSuccess', '1']),
  },
  // 杠杆免息券
  InterestFreeCoupon: {
    go: () => trackClick(['InterestFreeCoupon', '1']),
    close: () => trackClick(['InterestFreeCoupon', '2']),
  },
  // 杠杆体验金
  marginBonus: {
    go: () => trackClick(['marginBonus', '1']),
    close: () => trackClick(['marginBonus', '2']),
  },
};
// 全仓杠杆埋点
export const crossSensors = {
  ...commonSensors,
  // 杠杆交易步骤
  marginStepTutorial: {
    ...commonSensors.marginStepTutorial,
    guide: {
      expose: () => saTrackForBiz({}, ['marginStepTutorial', '1']),
      click: () => trackClick(['marginStepTutorial', '1']),
    },
  },
  // 全仓杠杆下单交易区
  marginTrading: {
    tab: () => trackClick(['crossMarginTrading', '1']),
    changeMulti: () => trackClick(['crossMarginTrading', '3']),
    setMulti: () => trackClick(['crossMarginTrading', '4']),
    transfer: () => trackClick(['crossMarginTrading', '5']),
    buy: {
      expose: symbol => saTrackForBiz({}, ['crossMarginTrading', '6'], { symbol }),
      click: symbol => trackClick(['crossMarginTrading', '6'], { symbol }),
    },
    sell: {
      click: symbol => trackClick(['crossMarginTrading', '7'], { symbol }),
    },
    kcsPayFees: () => trackClick(['crossMarginTrading', '8']),
    autoBorrow: () => trackClick(['crossMarginTrading', '9']),
    0.25: () => trackClick(['crossMarginTrading', '10']),
    0.5: () => trackClick(['crossMarginTrading', '11']),
    0.75: () => trackClick(['crossMarginTrading', '12']),
    1: () => trackClick(['crossMarginTrading', '13']),
  },
};
// 逐仓杠杆埋点
export const isolatedSensors = {
  ...commonSensors,
  // 杠杆交易步骤
  marginStepTutorial: {
    ...commonSensors.marginStepTutorial,
    guide: {
      expose: () => saTrackForBiz({}, ['isolatedStepTutorial', '1']),
      click: () => trackClick(['marginStepTutorial', '1']),
    },
  },
  // 逐仓杠杆下单交易区
  marginTrading: {
    tab: () => trackClick(['isolatedMarginTrading', '1']),
    changeMulti: () => trackClick(['isolatedMarginTrading', '3']),
    setMulti: () => trackClick(['isolatedMarginTrading', '4']),
    transfer: () => trackClick(['isolatedMarginTrading', '5']),
    buy: {
      expose: symbol => saTrackForBiz({}, ['isolatedMarginTrading', '6'], { symbol }),
      click: symbol => trackClick(['isolatedMarginTrading', '6'], { symbol }),
    },
    sell: {
      click: symbol => trackClick(['isolatedMarginTrading', '7'], { symbol }),
    },
    kcsPayFees: () => trackClick(['isolatedMarginTrading', '8']),
    autoBorrow: () => trackClick(['isolatedMarginTrading', '9']),
    0.25: () => trackClick(['isolatedMarginTrading', '10']),
    0.5: () => trackClick(['isolatedMarginTrading', '11']),
    0.75: () => trackClick(['isolatedMarginTrading', '12']),
    1: () => trackClick(['isolatedMarginTrading', '13']),
  },
};
