/**
 * Owner: mike@kupotech.com
 */
import { forEach, isEmpty, includes, map, drop } from 'lodash';
import Decimal from 'decimal.js';
/**
 * @description: 处理现货资产列表数据
 * @param {object} tradeMap 比比资产map
 * @param {symbol} currentSymbol
 * @param {array} allSymbolsArr 所有交易对
 * @param {object} smallExchangeConfig 用户小额资产配置
 * @param {boolean} isHideSmallAssets 是否隐藏小额资产
 * @return {array}
 */
export const getSpotDataSource = ({
  tradeMap,
  currentSymbol,
  allSymbolsArr,
  smallExchangeConfig,
  isHideSmallAssets,
  isLargeAssets,
}) => {
  if (isEmpty(tradeMap)) return [];
  const symbolDecode = currentSymbol.split('-');
  const [base, quota] = symbolDecode;

  // 按照base分类
  const allSymbolBaseMap = new Map();
  allSymbolsArr.forEach((row) => {
    if (!allSymbolBaseMap.get(row.baseCurrency)) {
      allSymbolBaseMap.set(row.baseCurrency, []);
    }
    allSymbolBaseMap.get(row.baseCurrency).push({
      symbolCode: row.symbolCode,
      symbolName: row.symbol.replace('-', '/'),
    });
  });

  let lists = [tradeMap[base], tradeMap[quota]];
  // 检查小额资产
  const checkAmount = (currencyInfo) => {
    if (isHideSmallAssets) {
      return isLargeAssets(currencyInfo.totalBalance, currencyInfo.currency);
    }
    return Number(currencyInfo.totalBalance) > 0;
  };
  forEach(tradeMap, (currencyInfo, currency) => {
    if (
      !symbolDecode.includes(currency) &&
      checkAmount(currencyInfo) &&
      lists.length <= 50
    ) {
      lists.push(currencyInfo);
    }
  });
  // 增加二级数据
  lists = map(lists, (item) => {
    item = { ...item };
    if (allSymbolBaseMap.get(item.currency)) {
      item.subLists = allSymbolBaseMap.get(item.currency);
    }
    return item;
  });

  return lists;
};

const exclusiveArr = ['BTC', 'KCS', 'ETH', 'NEO', 'USDT'];
// 通过币种来过滤交易对
const filterSymbolByCurrency = (currency, symbol) => {
  const [base, quote] = symbol.split('-');
  let isContain = false;
  if (includes(exclusiveArr, currency)) {
    isContain = base === currency;
  } else {
    isContain = [base, quote].includes(currency);
  }
  return isContain;
};
/**
 * @description: 处理全仓杠杆资产列表数据
 * @param {symbol} currentSymbol
 * @param {object} marginSymbolsMap 全仓杠杆支持的所有交易对
 * @param {object} marginAssetsMap 用户杠杆资产
 * @param {array} marginAssets 用户杠杆资产
 * @param {boolean} isLiabilityOnly
 * @return {array}
 */
export const getCrossDataSource = ({
  currentSymbol,
  marginSymbolsMap,
  marginAssetsMap,
  marginAssets,
  isLiabilityOnly,
}) => {
  const symbolDecode = currentSymbol.split('-');
  const [base, quote] = symbolDecode;
  let nextList = [marginAssetsMap[base], marginAssetsMap[quote]].filter(
    (v) => v,
  );
  // 检查只显示负债
  const checkAmount = (item) => {
    if (isLiabilityOnly) {
      return Number(item.liability) > 0;
    }
    return (
      (+item.totalBalance ||
        +item.availableBalance ||
        +item.holdBalance ||
        +item.liability) > 0
    );
  };
  const availMarginSymbols = Object.values(marginSymbolsMap).filter(
    (v) => v?.isMarginEnabled && v.symbol !== currentSymbol,
  );

  forEach(marginAssets, (v) => {
    const item = marginAssetsMap[v.currency];
    const { currency } = item || {};
    // 最多展示50条
    if (
      !symbolDecode.includes(currency) &&
      checkAmount(item) &&
      nextList.length < 50
    ) {
      nextList.push(item);
    }
  });

  nextList = map(nextList, (item) => {
    item = { ...item };
    const subLists = availMarginSymbols.filter((v) =>
      filterSymbolByCurrency(item.currency, v.symbol),
    );
    if (subLists.length > 0) {
      item.subLists = subLists;
    }
    return item;
  });

  return nextList;
};
const getTotal = (item, key) => {
  return Decimal(item.baseAsset?.[key] || 0)
    .add(item.quoteAsset?.[key] || 0)
    .toNumber();
};
/**
 * @description: 处理逐仓资产列表数据
 * @param {object} positionMap 来自推送的数据
 * @param {symbol} currentSymbol
 * @param {array} assetsList 来自轮训的全部数据
 * @param {boolean} isCurrencyPairOnly
 * @return {array}
 */
export const getISODataSource = ({
  positionMap,
  currentSymbol,
  assetsList,
  isCurrencyPairOnly,
}) => {
  let lists = assetsList;
  const [base, quote] = currentSymbol.split('-');
  const currentPosition = positionMap[currentSymbol]
    ? {
        ...positionMap[currentSymbol],
        baseAsset: positionMap[currentSymbol][base],
        quoteAsset: positionMap[currentSymbol][quote],
      }
    : null;
  if (!assetsList.length) {
    lists = currentPosition ? [currentPosition] : [];
  } else if (currentSymbol === assetsList[0]?.tag && currentPosition) {
    lists = [currentPosition, ...drop(assetsList)];
  }
  const newLists = [];
  forEach(lists, (item) => {
    item = {
      ...item,
      hasArrow: currentSymbol !== item.tag, // 方便判断是否可以点击
      // 构造base + quota的和 方便之后table排序
      totalBalance: getTotal(item, 'totalBalance'),
      availableBalance: getTotal(item, 'availableBalance'),
      holdBalance: getTotal(item, 'holdBalance'),
      liability: getTotal(item, 'liability'),
    };
    if (isCurrencyPairOnly) {
      if (item.tag === currentSymbol) {
        newLists.push(item);
      }
    } else {
      newLists.push(item);
    }
  });
  return newLists;
};
