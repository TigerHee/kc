/**
 * Owner: mike@kupotech.com
 */
import useFutureSymbolInfo from './useFutureSymbolInfo.js';
import useSpotSymbolInfo from './useSpotSymbolInfo.js';
import { isFutureSymbol } from 'Bot/helper';

/**
 * @description: 获取交易对信息统一入口, 慎用, 少用;
 * NOTICE: 因为在hooks中有if判断, 所以一个组件中不能同时是现货/合约类型; 分开了,使用就没有问题
 * @param {*} symbolCode
 * @return {*}
 */
const useSymbolInfo = (symbolCode) => {
  return isFutureSymbol(symbolCode)
    ? useFutureSymbolInfo(symbolCode)
    : useSpotSymbolInfo(symbolCode);
};

export default useSymbolInfo;
