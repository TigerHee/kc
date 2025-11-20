/**
 * Owner: garuda@kupotech.com
 * 该功能主要用做 大功能/新功能/神策AB 的集中管理开关
 * 模版配置参照下方的 template config
 * 使用示例
 * futuresFeatureToggle.isFeatureEnabled(key)
 */
import { FEATURE_FUTURES_TAX } from './constant';
import FeatureToggleManager from './manager';

// template config
// export const futuresFeatureConfig = {
//   featureA: {
//     toggle: true,
//   },
//   featureB: {
//     toggle: false,
//     // 跟神策 ab 配合使用
//     sensorsAB: {
//       key: 'TRADE_FUTURES_CROSS_AB',
//       valueStr: 'new',
//     },
//   },
// };

// 配置开关-使用示例
export const futuresFeatureConfig = {
  [FEATURE_FUTURES_TAX]: {
    toggle: false, // FIXME: 泰国站先屏蔽
  },
};

export const futuresFeatureToggleManager = FeatureToggleManager.getInstance(
  'futures',
  futuresFeatureConfig,
);

export const futuresFeatureToggle = (key) => {
  return futuresFeatureToggleManager.isFeatureEnabled(key);
};
