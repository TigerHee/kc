/**
 * Owner: harry.lai@kupotech.com
 */
export const AB_TEST_KEYS = {
  /** 交易合约 abTest  */
  TRADE_FUTURES_AB: 'TRADE_FUTURES_AB',
  /** 新版交易大厅 abTest  */
  TRADE_AB: 'TRADE_AB',
  /** 合约全仓 abTest */
  TRADE_FUTURES_CROSS_AB: 'TRADE_FUTURES_CROSS_AB',
  // 策略融合
  TRADE_BOT_AB: 'TRADE_BOT_VERSION',
};

export const getABtestDefaultState = () => ({
  [AB_TEST_KEYS.TRADE_FUTURES_AB]: 'new', // 默认为new
  [AB_TEST_KEYS.TRADE_AB]: 'new', //   默认直接赋值为新版本，去掉 abTest 接口请求代码
  [AB_TEST_KEYS.TRADE_FUTURES_CROSS_AB]: 'old',
});
