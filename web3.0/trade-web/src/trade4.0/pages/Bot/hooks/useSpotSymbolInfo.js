/**
 * Owner: mike@kupotech.com
 */
import { useSelector, shallowEqual } from 'dva';
import { toCableCase, decodeSymbol, toSplitCase, formatNumber } from 'Bot/helper';
import { maxQuotaPrecision } from 'Bot/config';
import { getStore } from 'src/utils/createApp';
import { useMemo } from 'react';
import modelNameCfg from '../components/modelNameConfig';

// 现货/合约交易对下架， 策略历史记录没有了该交易对的精度信息， 采用默认的12位处理
// 数据的显示 受到model的影响，使用的时候一定要注意
const cacheSymbolInfoMap = new Map();
const defaultInfo = (base, quota) => ({
  baseMinSize: 0,
  quoteMinSize: 0,
  basePrecision: maxQuotaPrecision,
  usdtRealInputPrecision: maxQuotaPrecision,
  quotaPrecision: maxQuotaPrecision,
  quotePrecision: maxQuotaPrecision,
  pricePrecision: maxQuotaPrecision,
  precision: {
    [base]: maxQuotaPrecision,
    [quota]: maxQuotaPrecision,
  },
  base,
  quota,
  cbase: base,
  cquota: quota,
  symbol: `${base}-${quota}`,
  symbolName: `${base}-${quota}`,
  symbolCode: `${base}-${quota}`,
  symbolNameText: `${base}/${quota}`,
});

// 在basic model中调用设置
export const setSpotSymbolInfo = (item) => {
  const { basePrecision, quotePrecision, symbol, symbolCode, baseName, quoteName } = item;
  const [cbase, cquota] = decodeSymbol(symbolCode); // code拆分
  const info = {
    ...item,
    precision: {
      // 可以按照code取精度
      [cbase]: basePrecision,
      [cquota]: quotePrecision,
    },
    base: baseName,
    quota: quoteName,
    cbase,
    cquota,
    symbolName: symbol,
    quotaPrecision: quotePrecision,
    symbolNameText: symbol.replace('-', '/'), // 页面上直接展示用
  };
  // 用symbolCode做key 方便查找
  cacheSymbolInfoMap.set(symbolCode, info);
};
// 获取symbolName，在某些场景快速，
export const getSymbolName = (symbolCode) => {
  if (!symbolCode) return '';
  return getSymbolInfo(symbolCode)?.symbolNameText || symbolCode;
};
// 在确保已经写入数据后， 函数可以直接调用
export const getSymbolInfo = (symbol) => {
  return cacheSymbolInfoMap.get(toCableCase(symbol)) || defaultInfo(...decodeSymbol(symbol));
};
// 响应式组件使用
// 注意 建议不要大量使用，因为数据map很大，会造成页面卡顿， 如果需要大量使用 请直接使用model数据放在顶层
export const SymbolName = ({ value }) => {
  const symbolInfo = useSymbolInfo(value);
  return toSplitCase(symbolInfo?.symbolName || value);
};
// 这个use和直接用getSymbolInfo没用太多区别, 代码是从H5迁移过来的. 进入策略的时候, cacheSymbolInfoMap已经设置好了
const useSymbolInfo = (symbol) => {
  //  主要用于更新
  const modelName = modelNameCfg.getModelName();
  const changer = useSelector(state => state[modelName].symbols);
  return useMemo(() => getSymbolInfo(symbol), [symbol, changer]);
};
export default useSymbolInfo;

// currency 处理
// let cacheCurrencyInfoMap = {};
// 获取
export const getCurrencyInfo = (currency) => {
  const state = getStore().getState();
  const categories = state.categories;
  return (
    categories?.[currency] || {
      currencyName: currency, //
      iconUrl: '',
      precision: maxQuotaPrecision,
    }
  );
};
// 通过currency后去name
export const getCurrencyName = (currency) => {
  if (!currency) return '';
  return getCurrencyInfo(currency)?.currencyName || currency;
};
// 在basic model中调用设置
// export const setCurrencyInfo = (info) => {
//   cacheCurrencyInfoMap = info;
// };
// 注意 建议不要大量使用，因为数据map很大，会造成页面卡顿， 如果需要大量使用 请直接使用model数据放在顶层
// append： 方便在循环中使用 KCS USDT 添加空格
export const CurrencyName = ({ value, append }) => {
  const currencyInfo = useSelector((state) => state.categories, shallowEqual);
  let name = '';
  if (value) {
    name = currencyInfo[value]?.currencyName || value;
  }
  return append ? name + append : name;
};
// 将币种价值精度展示
export const CurrencyValue = ({ currency, value }) => {
  const currencyInfo = useSelector((state) => state.categories, shallowEqual);
  let precision = '';
  if (currency) {
    precision = currencyInfo[currency]?.precision || maxQuotaPrecision;
  }
  return formatNumber(value, precision);
};
