/*
 * @Date: 2024-06-04 15:08:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-01-23 11:11:46
 */
import { IS_PROD, _DEV_ } from 'src/utils/env';
import { getABtestResultBySensorKey } from './util';

const TRANSFER_ORDER_TO_TRADE_PUBLIC_WEB_SENSOR_KEY = 'order_page_transfer_trade';
const TRANSFER_ASSETS_TO_ASSETS_WEB_SENSOR_KEY = 'assets_page_transfer_assets';
const TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_OVERVIEW_SENSOR_KEY =
  'assets_page_transfer_assets_overview';
const TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_MAIN_ACCOUNT_SENSOR_KEY =
  'assets_page_transfer_assets_main_account';
const TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_DEPOSIT_SENSOR_KEY = 'assets_page_transfer_assets_deposit';
const GEMSLOT_WEB_SENSOR_KEY = 'gemslot_activity';
const TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_PRE_WITHDRAW_SENSOR_KEY =
  'assets_page_transfer_assets_pre_withdraw';
const TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_RECORD_SENSOR_KEY =
  'assets_page_transfer_assets_record_detail';
const TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_TRADE_ACCOUNT_SENSOR_KEY =
  'assets_page_transfer_assets_trade_account';
const TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_MARGIN_ACCOUNT_SENSOR_KEY =
  'assets_page_transfer_assets_margin_account';
const TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_ASSETS_DETAIL_SENSOR_KEY =
  'assets_page_transfer_assets_assets_detail';
// 机器人资产页面
const TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_BOT_ACCOUNT_SENSOR_KEY =
  'assets_page_transfer_assets_bot_account';
// 合约资产页面
const FUTURES_ASSETS_TO_ASSETS_WEB_SENSOR_KEY = 'assets_page_futures_account';

const TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_EARN_ACCOUNT_SENSOR_KEY =
'assets_page_transfer_assets_earn_account';

const commonGetEnable = async (key) => {
  const data = await getABtestResultBySensorKey(key, {
    defaultValue: '0',
    valueType: 'String',
  });

  return data === '1';
};

/**
 * 神策获取资产中心提现页面迁移assets-web， 是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getEnableAssets2AssetsWeb = () =>
  commonGetEnable(TRANSFER_ASSETS_TO_ASSETS_WEB_SENSOR_KEY);

/**
 * 神策获取资产中心概览页面迁移assets-web， 是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getEnableAssets2AssetsWebForOverview = () =>
  commonGetEnable(TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_OVERVIEW_SENSOR_KEY);

/**
 * 神策获取资产中心资金账户页面迁移assets-web， 是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getEnableAssets2AssetsWebForMainAccount = () =>
  commonGetEnable(TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_MAIN_ACCOUNT_SENSOR_KEY);

/**
 * 神策获取资产中心充值页面迁移assets-web， 是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getEnableAssets2AssetsWebForDeposit = () =>
  commonGetEnable(TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_DEPOSIT_SENSOR_KEY);

/**
 * 神策获取资产中心交易账户页面迁移assets-web， 是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getEnableAssets2AssetsWebForTradeAccount = () =>
  commonGetEnable(TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_TRADE_ACCOUNT_SENSOR_KEY);

/**
 * 神策获取资产中心提币前置页面迁移assets-web， 是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getEnableAssets2AssetsWebForPreWithdraw = () =>
  commonGetEnable(TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_PRE_WITHDRAW_SENSOR_KEY);
/**
 * 神策获取资产中心充提记录迁移assets-web， 是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getEnableAssets2AssetsWebForRecord = () =>
  commonGetEnable(TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_RECORD_SENSOR_KEY);

/**
 * 神策获取资产中心杠杠账户页面迁移assets-web， 是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getEnableAssets2AssetsWebForMarginAccount = () =>
  commonGetEnable(TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_MARGIN_ACCOUNT_SENSOR_KEY);

/**
 * 神策获取资产中心账户明细页面迁移assets-web， 是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getEnableAssets2AssetsWebForAssetsDetail = () =>
  commonGetEnable(TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_ASSETS_DETAIL_SENSOR_KEY);

/**
 * 神策获取资产中心  机器人资产页面  页面迁移assets-web， 是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getEnableBotAccount = () => {
  if (!IS_PROD) {
    return '1';
  }
  return commonGetEnable(TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_BOT_ACCOUNT_SENSOR_KEY);
};

/**
 * 神策获取资产中心  合约资产页面  页面迁移assets-web， 是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getEnableFuturesAccount = () => {
  if (_DEV_) {
    return '1';
  }
  return commonGetEnable(FUTURES_ASSETS_TO_ASSETS_WEB_SENSOR_KEY);
};


/**
 * 神策获取资产中心  金融账户资产页面  页面迁移assets-web， 是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getEnableEarnAccount = () => {
  return commonGetEnable(TRANSFER_ASSETS_TO_ASSETS_WEB_FOR_EARN_ACCOUNT_SENSOR_KEY);
};
