/**
 * Owner: garuda@kupotech.com
 * 使用到其它内置方法的，都从这里引入
 */
import getMainsiteLink from 'src/utils/getMainsiteLink';

import storage from 'utils/storage';

import voiceQueue from '@/utils/voice';

export { event } from '@/utils/event';
export { TOOLTIP_EVENT_KEY } from '@/components/FormComponent/config';
export { siteCfg } from 'config';
export { VERIFY_END_EVENT_NAME } from '@/pages/OrderForm/components/Verify';

export {
  quantityPlaceholder,
  formatCurrency,
  formatNumber,
  tradeOrderAnalyse,
} from '@/utils/futures';

export { thousandPointed, floadToPercent, formatNumberKMB } from '@/utils/format';

export { intlFormatNumber, intlFormatDate } from '@/hooks/common/useIntlFormat';

export { evtEmitter, searchToJson, getDigit, toPercent, guid, getState } from 'helper';

export {
  QUANTITY_UNIT,
  CURRENCY_UNIT,
  AUTH_ADVANCED_INTRUST,
  AUTH_STOP_ORDER,
  CONFIRM_CONFIG,
  ORDER_CONFIRM_CHECKED,
  MISOPERATION_KEY,
  storagePrefix,
  MARGIN_MODE_ISOLATED,
  MARGIN_MODE_CROSS,
  TRIAL_FUND_INSUFFICIENT,
  ALL_DURATION,
  INTERFACE_DURATION,
  orderVars,
} from '@/meta/futures';

export { FUTURES } from '@/meta/const';

export { PRICE_DEVIATION_KEY } from '@/pages/InfoBar/SettingsToolbar/TradeSetting/futuresConfig';

export {
  formatSizeSide,
  newValue,
  calcIMR,
  calcMMR,
  calcCrossOrderMargin,
  calcCrossMaxOrder,
  calcCrossExpectLiquidation,
  calcValue,
} from '@/pages/Futures/calc';

export { getStore } from 'utils/createApp';
export { _t, _tHTML, addLangToPath } from 'utils/lang';
export {
  toPow,
  multiply,
  toNonExponential,
  dividedBy,
  plus,
  greaterThan,
  greaterThanOrEqualTo,
  equals,
  lessThan,
  lessThanOrEqualTo,
  abs,
  minus,
  toDP,
  percent,
  toFixed,
  max,
  min,
  ln,
  toNearest,
} from 'utils/operation';

export {
  ABC_POSITION,
  ABC_WALLET,
  ABC_CROSS_LEVERAGE,
  ABC_ORDER_STATISTICS,
  ABC_TYPE_SETTING,
  ABC_TYPE_CROSS,
} from '@/components/AbnormalBack/constant';

export { trackClick, gaExpose as trackExposeS, trackCustomEvent } from 'utils/ga';

export {
  SENSORS_MARGIN_TYPE,
  tradeLongShort,
  tradeConfirm,
  tradeResult,
  contractOpenTransfer,
  CALCULATOR,
  TRADE_ORDER_STOP,
  START_CALC,
  TO_CALC_ORDER,
  TRADE_CONFIRM,
  SWITCH_QTY,
  TRADE_ORDER_TYPE,
  BONUS_MODE_SWITCH,
  TRANSFER,
  OPEN_FUTURES,
  FUTURES_PWD,
  RISK_LIMIT_AUTO,
  RISK_LIMIT_GUIDE,
  RISK_LIMIT_ORDER,
  FUTURES_ORDER_EXPLAIN,
} from '@/meta/futuresSensors/trade';

export { FUTURES_TRIAL_COUPONS } from '@/meta/multSiteConfig/futures';

// TIPS: 合约跟交易大厅有差异
export { isFuturesNew } from '@/meta/const';

// TIPS: 合约跟交易大厅有差异
export { WrapperContext } from '../config';

// TIPS: 合约跟交易大厅有差异
export { withYScreen } from '@/pages/OrderForm/config';

export { sliderMarks } from '@/pages/Futures/components/Leverage/utils';

export { styled, fx } from '@/style/emotion';

export { storage, voiceQueue, getMainsiteLink };
