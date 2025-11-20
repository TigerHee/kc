/*
 * owner: Clyne@kupotech.com
 */
import { useSelector } from 'dva';
import { namespace, defaultSellAndBuy } from '../config';
import { getStore } from 'src/utils/createApp';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { isEqual } from 'lodash';
// 获取model的列表数据
export const getModelList = (key) => {
  const currentSymbol = useGetCurrentSymbol();
  const data = useSelector(
    (state) => (state[namespace].data || {})[currentSymbol] || defaultSellAndBuy,
  );
  return key ? data[key] : data;
};

/**
 * 获取买一卖一
 * @returns
 */
export const getBuySell1 = () => {
  const data = getStore().getState();
  const currentSymbol = data.trade?.currentSymbol;
  const { buy, sell } = (data[namespace].data || {})[currentSymbol] || defaultSellAndBuy;
  const sellLastIndex = (sell || []).length - 1;
  return {
    buy1: (buy[0] || [])[0],
    sell1: (sell[sellLastIndex] || [])[0],
  };
};

window.getBuySell1 = getBuySell1;

/**
 * 获取买一卖一hooks
 * @returns
 */
export const useGetBuySell1 = () => {
  const currentSymbol = useGetCurrentSymbol();
  const { sell, buy } = useSelector((state) => {
    return (state[namespace].data || {})[currentSymbol] || defaultSellAndBuy;
  }, isEqual);

  const sellLastIndex = (sell || []).length - 1;
  return {
    buy1: (buy[0] || [])[0],
    sell1: (sell[sellLastIndex] || [])[0],
  };
};
