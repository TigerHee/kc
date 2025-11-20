/**
 * Owner: harry.lai@kupotech.com
 */
import includes from 'lodash/includes';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { addLangToPath } from 'src/utils/lang';
import { mergeColumns } from './nodeHelper';

export const formatOrderMoreUrl = (tradeType, subRoute = '') => {
  const { orderLink } = TRADE_TYPES_CONFIG[tradeType] || {};
  const formatLink = orderLink ? `${orderLink}${subRoute}` : TRADE_TYPES_CONFIG.TRADE.orderLink;

  return addLangToPath(formatLink);
};

export const filterList = (list = [], { ocoEnable, tsoEnable, tradeType }) => {
  const conf = TRADE_TYPES_CONFIG[tradeType] || {};
  const keys = [];
  // oco
  if (!ocoEnable || !conf.isOCODisplay) {
    keys.push('oco');
  }
  // 跟踪委托
  if (!tsoEnable || !conf.showTSO) {
    keys.push('tso');
  }
  // 过滤数据
  if (keys.length) {
    list = list.filter((item) => keys.every((str) => !includes(item.value, str)));
  }
  return list.filter((item) => item.show !== false);
};

// 当前委托 (以下内容如需改动，需保证相加为1)
export const currentRowPercentage = ({ screen }) => {
  if (includes(['sm', 'md', 'lg'], screen)) {
    return [];
  } else if (screen === 'lg1') {
    return [0.11, 0.13, 0.14, 0.09, 0.195, 0.195, 0.14];
  } else if (screen === 'lg2') {
    return [0.08, 0.1, 0.1, 0.08, 0.14, 0.14, 0.14, 0.14, 0.08];
  } else {
    return [0.1, 0.1, 0.1, 0.06, 0.14, 0.14, 0.14, 0.14, 0.08];
  }
};

export const stopRowPercentage = ({ screen }) => {
  if (includes(['sm', 'md', 'lg'], screen)) {
    return [];
  } else if (screen === 'lg1') {
    return [0.1, 0.13, 0.13, 0.08, 0.22, 0.22, 0.12];
  } else if (screen === 'lg2') {
    return [0.08, 0.12, 0.12, 0.08, 0.17, 0.17, 0.17, 0.09];
  } else {
    return [0.1, 0.12, 0.12, 0.08, 0.16, 0.16, 0.16, 0.1];
  }
};

export const historyRowPercentage = ({ screen }) => {
  if (includes(['sm', 'md', 'lg'], screen)) {
    return [];
  } else if (screen === 'lg1') {
    return [0.09, 0.12, 0.12, 0.08, 0.12, 0.175, 0.175, 0.12];
  } else if (screen === 'lg2') {
    return [0.08, 0.1, 0.1, 0.07, 0.14, 0.13, 0.13, 0.15, 0.1];
  } else {
    return [0.1, 0.1, 0.1, 0.06, 0.12, 0.1, 0.1, 0.12, 0.12, 0.08];
  }
};

export const dealRowPercentage = ({ screen }) => {
  if (includes(['sm', 'md', 'lg'], screen)) {
    return [];
  } else if (screen === 'lg1') {
    return [0.09, 0.13, 0.13, 0.08, 0.195, 0.195, 0.18];
  } else if (screen === 'lg2') {
    return [0.07, 0.12, 0.12, 0.07, 0.14, 0.16, 0.16, 0.16];
  } else {
    return [0.1, 0.12, 0.11, 0.06, 0.145, 0.155, 0.155, 0.155];
  }
};

export const mergeColumnElementsWithRange = (data, ranges) => {
  ranges.sort((a, b) => a.leftIndex - b.leftIndex);

  for (let i = 0; i < ranges.length - 1; i++) {
    if (ranges[i].rightIndex >= ranges[i + 1].leftIndex) {
      throw new Error('Ranges overlap, which is not allowed.');
    }
  }

  const mergedData = [];
  let rangeIndex = 0;
  let currentRange = ranges.length ? ranges[rangeIndex] : null;

  for (let i = 0; i < data.length; i++) {
    if (currentRange && i === currentRange.leftIndex) {
      let mergedValue = data[i];
      for (let j = i + 1; j <= currentRange.rightIndex; j++) {
        mergedValue = mergeColumns(mergedValue, data[j], currentRange.options);
      }
      mergedData.push(mergedValue);
      i = currentRange.rightIndex; // Skip the merged elements.

      if (rangeIndex < ranges.length - 1) {
        rangeIndex += 1; // Increment rangeIndex separately as per ESLint rules
        currentRange = ranges[rangeIndex];
      } else {
        currentRange = null;
      }
    } else {
      mergedData.push(data[i]);
    }
  }

  return mergedData;
};
