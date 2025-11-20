/**
 * Owner: willen@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2022-03-28 16:34:03
 * @Description: 杠杆神策埋点配置
 */
import { get } from 'lodash';
import { trackClick } from 'utils/ga';

const MARGIN_SENSORS = {
  // 杠杆免息券
  InterestFreeCoupon: {
    claim: () => trackClick(['InterestFreeCoupon', '1']),
    borrow: () => trackClick(['InterestFreeCoupon', '2']),
    transfer: () => trackClick(['InterestFreeCoupon', '5']),
    0.25: () => trackClick(['InterestFreeCoupon', '6']),
    0.5: () => trackClick(['InterestFreeCoupon', '7']),
    0.75: () => trackClick(['InterestFreeCoupon', '8']),
    1: () => trackClick(['InterestFreeCoupon', '9']),
    go: () => trackClick(['InterestFreeCoupon', '1']),
    close: () => trackClick(['InterestFreeCoupon', '2']),
  },
  // 杠杆体验金
  marginBonus: {
    receive: () => trackClick(['marginBonus', '1']),
    iknow: () => trackClick(['marginBonus', '3']),
    borrow: () => trackClick(['marginBonus', '4']),
    go: () => trackClick(['marginBonus', '1']),
    close: () => trackClick(['marginBonus', '2']),
  },
  // 全仓杠杆账户
  marginAccountCross: {
    transfer: () => trackClick(['marginAccountCross', '1']),
    trade: () => trackClick(['marginAccountCross', '2']),
    borrow: () => trackClick(['marginAccountCross', '3']),
    repay: () => trackClick(['marginAccountCross', '4']),
    ISOLATED: () => trackClick(['marginAccountCross', '5']),
    detail: () => trackClick(['marginAccountCross', '6']),
    search: () => trackClick(['marginAccountCross', '7']),
    hide: () => trackClick(['marginAccountCross', '8']),
    pnl: () => trackClick(['marginAccountCross', '9']),
  },
  // 逐仓杠杆账户
  marginAccountIsolated: {
    MARGIN: () => trackClick(['marginAccountIsolated', '1']),
    transfer: () => trackClick(['marginAccountIsolated', '2']),
    trade: () => trackClick(['marginAccountIsolated', '3']),
    borrow: () => trackClick(['marginAccountIsolated', '4']),
    repay: () => trackClick(['marginAccountIsolated', '5']),
    detail: () => trackClick(['marginAccountIsolated', '6']),
    search: () => trackClick(['marginAccountIsolated', '7']),
    hide: () => trackClick(['marginAccountIsolated', '8']),
    pnl: () => trackClick(['marginAccountIsolated', '9']),
  },
  // 杠杆账户开通杠杆交易
  openMarginAgreement: {
    open: () => trackClick(['openMarginAgreement', '1']),
    openConfirm: () => trackClick(['openMarginAgreement', '2']),
  },
  // 全仓订单查询页面
  crossMarginOrders: {
    margin: () => trackClick(['crossMarginOrders', '1']),
    current: () => trackClick(['crossMarginOrders', '2']),
    stopLoss: () => trackClick(['crossMarginOrders', '3']),
    history: () => trackClick(['crossMarginOrders', '4']),
    detail: () => trackClick(['crossMarginOrders', '5']),
    branchCancel: () => trackClick(['crossMarginOrders', '6']),
    exportCsv: () => trackClick(['crossMarginOrders', '7']),
    changeSymbol: () => trackClick(['crossMarginOrders', '8']),
    changeSide: () => trackClick(['crossMarginOrders', '9']),
    changeType: () => trackClick(['crossMarginOrders', '10']),
    cancel: () => trackClick(['crossMarginOrders', '11']),
  },
  // 逐仓订单查询页面
  isolatedMarginOrders: {
    isolated: () => trackClick(['isolatedMarginOrders', '1']),
    current: () => trackClick(['isolatedMarginOrders', '2']),
    stopLoss: () => trackClick(['isolatedMarginOrders', '3']),
    history: () => trackClick(['isolatedMarginOrders', '4']),
    detail: () => trackClick(['isolatedMarginOrders', '5']),
    branchCancel: () => trackClick(['isolatedMarginOrders', '6']),
    exportCsv: () => trackClick(['isolatedMarginOrders', '7']),
    changeSymbol: () => trackClick(['isolatedMarginOrders', '8']),
    changeSide: () => trackClick(['isolatedMarginOrders', '9']),
    changeType: () => trackClick(['isolatedMarginOrders', '10']),
    cancel: () => trackClick(['isolatedMarginOrders', '11']),
  },
  // 杠杆借入一级导航栏
  marginBorrowNavigation: {
    LEND: () => trackClick(['marginBorrowNavigation', '1']),
    LOAN: () => trackClick(['marginBorrowNavigation', '2']),
    BORROW: () => trackClick(['marginBorrowNavigation', '3']),
    guide: () => trackClick(['marginBorrowNavigation', '4']),
  },
  // 杠杆借入账户展示区
  marginBorrowAccountDisplay: {
    MARGIN: () => trackClick(['marginBorrowAccountDisplay', '1']),
    ISOLATED: () => trackClick(['marginBorrowAccountDisplay', '2']),
    repay: () => trackClick(['marginBorrowAccountDisplay', '3']),
  },
  // 杠杆借贷下单区
  marginBorrowTradingArea: {
    setting: () => trackClick(['marginBorrowTradingArea', '1']),
    7: () => trackClick(['marginBorrowTradingArea', '2']),
    14: () => trackClick(['marginBorrowTradingArea', '3']),
    28: () => trackClick(['marginBorrowTradingArea', '4']),
    all: () => trackClick(['marginBorrowTradingArea', '5']),
    0.25: () => trackClick(['marginBorrowTradingArea', '6']),
    0.5: () => trackClick(['marginBorrowTradingArea', '7']),
    0.75: () => trackClick(['marginBorrowTradingArea', '8']),
    1: () => trackClick(['marginBorrowTradingArea', '9']),
    borrow: () => trackClick(['marginBorrowTradingArea', '10']),
  },
  // 杠杆借入委托区
  marginBorrowOrderDisplayArea: {
    PENDING: () => trackClick(['marginBorrowOrderDisplayArea', '1']),
    DONE: () => trackClick(['marginBorrowOrderDisplayArea', '2']),
    repay: () => trackClick(['marginBorrowOrderDisplayArea', '3']),
    onlyCurrent: () => trackClick(['marginBorrowOrderDisplayArea', '4']),
  },
};

export default (path = [], data) => {
  const sensorsFunc = get(MARGIN_SENSORS, path);
  if (sensorsFunc) sensorsFunc(data);
};
