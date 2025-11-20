/**
 * Owner: harry.lai@kupotech.com
 */
import { getABtestDefaultState, AB_TEST_KEYS } from './constant';
import {
  getTradeFuturesAB,
  getTradeAB_test,
  getTradeFuturesCrossAB,
  getTradeBotAB_test,
} from './service';
import { makeTaskABTestResultByFetch, convertPromiseRespTask } from './util';

export * from './constant';

class ABTestManager {
  static instance;
  config;

  constructor(config) {
    // 确保 constructor 只被调用一次
    if (ABTestManager.instance) {
      throw new Error(
        `ABTestManager is a singleton and has already been created.
        Use ABTestManager.getInstance() instead.`,
      );
    }
    this.config = config || getABtestDefaultState();
    ABTestManager.instance = this;
  }

  static getInstance(config) {
    if (!ABTestManager.instance) {
      ABTestManager.instance = new ABTestManager(config);
    }
    return ABTestManager.instance;
  }

  updateABtestKey(key, value = '') {
    this.config = {
      ...this.config,
      [key]: value,
    };
  }

  updateABtestKeys(values) {
    this.config = {
      ...this.config,
      ...values,
    };
  }

  getConfig() {
    return this.config;
  }

  async initABtest() {
    try {
      const requestSensorABResultTask = await Promise.allSettled([
        // makeTaskABTestResultByFetch(AB_TEST_KEYS.TRADE_FUTURES_AB, getTradeFuturesAB),
        makeTaskABTestResultByFetch(AB_TEST_KEYS.TRADE_AB, getTradeAB_test),
        // makeTaskABTestResultByFetch(AB_TEST_KEYS.TRADE_FUTURES_CROSS_AB, getTradeFuturesCrossAB),
        makeTaskABTestResultByFetch(AB_TEST_KEYS.TRADE_BOT_AB, getTradeBotAB_test),
      ]);
      this.updateABtestKeys(convertPromiseRespTask(requestSensorABResultTask));
    } catch (err) {
      console.error(`ABTestManager.initABtestError`, err);
    }
  }
}

export const abTestManager = ABTestManager.getInstance();
export const getABTestConfigVisitor = () => abTestManager.getConfig();
