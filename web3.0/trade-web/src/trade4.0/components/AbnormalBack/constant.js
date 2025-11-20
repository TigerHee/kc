/**
 * Owner: garuda@kupotech.com
 */

export const ABC_TYPE_CROSS = 'futuresCross';

export const ABC_CROSS_GRAY = 'futuresCrossGray';
export const ABC_MARGIN_MODE = 'futuresMarginMode';
export const ABC_POSITION = 'futuresPosition';
export const ABC_WALLET = 'futuresWallet';
export const ABC_CROSS_LEVERAGE = 'futuresCrossLeverage';
export const ABC_ORDER_STATISTICS = 'futuresOrderStatistics';

// 某个异常展示组件 type 对应的配置
export const ABC_TYPE_SETTING = {
  [ABC_TYPE_CROSS]: [ABC_POSITION, ABC_WALLET, ABC_CROSS_LEVERAGE, ABC_ORDER_STATISTICS],
};
