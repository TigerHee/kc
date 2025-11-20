/**
 * Owner: mike@kupotech.com
 */
import { useSelector } from 'dva';
import { useMemo } from 'react';
import { _t, t } from 'Bot/utils/lang';
import { maxQuotaPrecision } from 'Bot/config';
import modelNameCfg from '../components/modelNameConfig';

// 现货/合约交易对下架， 策略历史记录没有了该交易对的精度信息， 采用默认的12位处理
// 合成合约symbolName
export const createSymbolName = (base, quote) => {
  // 在交易大厅， 初始化会先于页面组件， 而语言包是按需加载的， 所以需要用交易大厅的多语言key
  // 订单中心， 初始化是随着组件初始化的， 所以用自己的key
  const langFunc = window.bot_source_is_from_order_center ? _t : t;
  return `\u202D${base}/${quote} ${langFunc('contract.detail.perpetual')}\u202C`;
};
// LUNCUSDTM
// 数据的显示 受到model的影响，使用的时候一定要注意
const cacheSymbolInfoMap = new Map();
const defaultInfo = (symbolCode) => {
  const base = symbolCode?.replace('USDTM', '') || '';
  return {
    amplitudeRatio: null,
    changePrice: 0,
    changeRate: 0,
    isNotice: null,
    lastTradedPrice: 0,
    maxRiskLimit: 0,
    minAmount: null,
    multiplier: 1,
    precision: maxQuotaPrecision,
    profitPrecision: 2,
    pricePrecision: maxQuotaPrecision, // 模拟现货字段, 方便之后 合约现货一起用
    quotaPrecision: maxQuotaPrecision, // 模拟现货字段, 方便之后 合约现货一起用
    isInverse: false,
    base,
    cbase: base,
    cquota: 'USDT',
    quote: 'USDT',
    quota: 'USDT',
    symbol: `${base}USDTM`,
    symbolCode: `${base}USDTM`,
    symbolName: createSymbolName(base, 'USDT'),
    symbolNameText: createSymbolName(base, 'USDT'),
  };
};

// 在basic model中调用设置
export const setFutureSymbolInfo = (item) => {
  const ins = { ...item };
  ins.cbase = ins.baseCurrency;
  ins.base = ins.baseCurrency;
  // quota  quote 有点乱 兼容哈
  ins.quote = ins.quoteCurrency;
  ins.quota = ins.quoteCurrency;
  ins.cquota = ins.quoteCurrency;
  ins.precision = ins.pricePrecision || 0;
  // 兼容现货的使用方式字段
  ins.quotaPrecision = ins.precision; // 模拟现货字段, 方便之后 合约现货一起用
  ins.profitPrecision = ins.precision;
  ins.pricePrecision = ins.precision;
  // 根据base quote 合成展示的名字
  ins.symbolCode = ins.symbol;
  // 后端返回的数据中没有国际化
  ins.symbolName = createSymbolName(ins.base, ins.quote);
  ins.symbolNameText = createSymbolName(ins.base, ins.quote);
  cacheSymbolInfoMap.set(ins.symbol, ins);
};
// 在确保已经写入数据后， 函数可以直接调用
export const getSymbolInfo = (symbolCode) => {
  return cacheSymbolInfoMap.get(symbolCode) || defaultInfo(symbolCode);
};
// 获取symbolName，在某些场景快速，
export const getSymbolName = (symbolCode) => {
  if (!symbolCode) return '';
  return getSymbolInfo(symbolCode)?.symbolName || symbolCode;
};
// 响应式组件使用
// 注意 建议不要大量使用，因为数据map很大，会造成页面卡顿， 如果需要大量使用 请直接使用model数据放在顶层
export const SymbolName = ({ value }) => {
  const symbolInfo = useFutureSymbolInfo(value);
  return symbolInfo?.symbolName || value;
};
const useFutureSymbolInfo = (symbolCode) => {
  // 主要用于数据更新
  const modelName = modelNameCfg.getModelName();
  const changer = useSelector(state => state[modelName].futuresSymbols);
  return useMemo(() => getSymbolInfo(symbolCode), [symbolCode, changer]);
};
export default useFutureSymbolInfo;
