/**
 * Owner: mike@kupotech.com
 */

import Decimal from 'decimal.js';
import { times100, isDecimal } from 'Bot/helper';
import { getCurrencyName } from 'Bot/hooks/useSpotSymbolInfo';
/**
 * @description: 将数据大到小排列， 补齐不到100%的部分
 * @param {Array} data
 * @return {Array}
 */
export const handleSortPercent = (data = []) => {
  data = [...data];
  // 从大到小排序
  data.sort((a, b) => Number(b.percent) - Number(a.percent));
  // 百分数保留小数点后1位，若加起来味道100%，则由占比最大的补齐
  if (data.length) {
    let maxFormatedPercent = Decimal(100);
    data = data.map((item, index) => {
      item = { ...item };
      if (index === 0) return item;
      item.formatedPercent = times100(item.percent);
      maxFormatedPercent = maxFormatedPercent.minus(item.formatedPercent);
      return item;
    });
    data[0].formatedPercent = maxFormatedPercent.toNumber();
  }

  return data;
};
// percent是百分比
// 将percent有小数的转换成整数
export const transformDecimalToInteger = (data) => {
  let hasDecimal = 0;
  data = data.map((el) => {
    el.percent = Decimal(el.percent).times(100).toNumber();
    if (isDecimal(el.percent)) {
      hasDecimal += 1;
    }
    return { ...el };
  });
  // 没有小数 就返回
  if (hasDecimal === 0) return data;

  // 从小到大排序
  let sortData = data.sort((a, b) => Number(a.percent) - Number(b.percent));
  let hasPercent = 0;
  sortData = sortData.map((el, index) => {
    el = { ...el };
    if (index < sortData.length - 1) {
      el.percent = Math.ceil(el.percent);
      hasPercent += el.percent;
    }
    return el;
  });
  sortData[sortData.length - 1].percent = 100 - hasPercent;
  // 返回从大到小
  return sortData.sort((a, b) => Number(b.percent) - Number(a.percent));
};

/**
 *
 * @param {*} targets 旧的
 * @param {*} coins 新的
 * @returns
 */
export const diffChange = (targets, coins, valueKey = 'value') => {
  const change = [];
  // 以长的为基准循环
  const patch = targets.length > coins.length ? targets : coins;
  // 转换map结构方便取用
  const targetsMap = {}; // 之前的
  const coinsMap = {}; // 最新的
  const targetTexts = [];
  const add = {}; // 新增的
  targets.forEach((el) => {
    targetsMap[el.currency] = el;
    targetTexts.push(el.currency);
  });
  coins.forEach((el) => {
    coinsMap[el.currency] = el;
    if (!targetTexts.includes(el.currency)) {
      add[el.currency] = el;
    }
  });

  // 这个循环处理 差异性
  patch.forEach((el) => {
    const changeObj = {
      base: el.currency,
    };
    if (targetsMap[el.currency]) {
      changeObj.before = Number(targetsMap[el.currency][valueKey] || 0); // 百分比值 没有%
      changeObj.beforeBalance = Number(targetsMap[el.currency].balance || 0);
      // 使用之后就删除， 方便之后判断
      delete targetsMap[el.currency];
    } else {
      changeObj.before = 0;
      changeObj.beforeBalance = 0;
    }

    if (coinsMap[el.currency]) {
      changeObj.after = Number(coinsMap[el.currency][valueKey] || 0);
      changeObj.afterBalance = Number(coinsMap[el.currency].balance || 0);
      changeObj.triggerPrice = coinsMap[el.currency].triggerPrice;
      delete coinsMap[el.currency];
    } else {
      changeObj.after = 0;
      changeObj.afterBalance = 0;
    }
    changeObj.changer = changeObj.after - changeObj.before;
    change.push(changeObj);
  });
  // targetsMap coinsMap有可能有剩余的， 但他们之间应该没有共同的
  for (const tkey in targetsMap) {
    if (Object.prototype.hasOwnProperty.call(targetsMap, tkey)) {
      change.push({
        base: targetsMap[tkey].currency,
        triggerPrice: '',
        before: Number(targetsMap[tkey][valueKey] || 0),
        beforeBalance: Number(targetsMap[tkey].balance || 0),
        after: 0,
        afterBalance: 0,
        changer: -Number(targetsMap[tkey][valueKey] || 0),
      });
    }
  }

  for (const ckey in coinsMap) {
    if (Object.prototype.hasOwnProperty.call(coinsMap, ckey)) {
      change.push({
        base: coinsMap[ckey].currency,
        triggerPrice: coinsMap[ckey].triggerPrice,
        before: 0,
        beforeBalance: 0,
        after: Number(coinsMap[ckey][valueKey] || 0),
        afterBalance: Number(coinsMap[ckey].balance || 0),
        changer: Number(coinsMap[ckey][valueKey] || 0),
      });
    }
  }
  return {
    change,
    add, // 找出新增的
  };
};

/**
 * @description: 去除额外的字段
 * @param {*} method
 * @return {*}
 */
export const dropOthers = (method) => {
  const obj = {};
  const only = ['interval', 'threshold', 'autoChange'];
  for (const key in method) {
    if (only.includes(key)) {
      obj[key] = method[key];
    }
  }
  return obj;
};
/**
 * @description: 提交的时候去除空， 不然后端会报错
 * @param {*} obj
 * @return {*}
 */
export const dropNull = (obj) => {
  const OBJ = {};
  Object.keys(obj).forEach((key) => {
    if (![null, '', undefined].includes(obj[key])) {
      OBJ[key] = obj[key];
    }
  });
  return OBJ;
};
/**
 * @description: 将后端返回的数据，value percent * 100
 * @param {*} targets
 * @return {*}
 */
export const timesPercent100 = (targets = []) => {
  return targets.map((coin) => {
    coin = { ...coin };
    coin.percent = times100(coin.percent);
    coin.value = coin.percent;
    return coin;
  });
};

export const getSymbolsNameTexts = (snapshots) => {
  return (
    snapshots?.map((coin) => getCurrencyName(coin.currency)).join('、') || '--'
  );
};
