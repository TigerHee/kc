/**
 * Owner: garuda@kupotech.com
 */
import { useSelector } from 'dva';
import { findIndex, pullAt } from 'lodash';
import { useMemo } from 'react';

import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useGetPosTableData } from '@/hooks/futures/usePosition';
import { isContractSettlement } from '@/pages/Futures/hooks/useContractSettlement';
import { namespace } from '../config';

const settlementFilter = (pos = []) => {
  const ret = pos.concat([]).filter(({ symbol }) => {
    return isContractSettlement(symbol);
  });
  return ret;
};

const useReorderPosition = () => {
  const pos = useGetPosTableData();
  const oriData = [].concat(pos);
  const currentSymbol = useGetCurrentSymbol();
  const isSettle = useSelector((state) => state[namespace].settleFilter);
  // const practicalSymbol = useRef();

  const reorderList = useMemo(() => {
    const data = isSettle ? settlementFilter(oriData) : oriData;
    if (!data?.length || data?.length < 1 || !currentSymbol) return data;
    const newData = data.concat([]);
    // 使用 lodash 的 findIndex 方法找到当前 symbol 对应的对象
    const currentIndex = findIndex(newData, { symbol: currentSymbol });
    // const isExist = currentIndex !== -1;
    // // 当前 symbol 存在，赋值
    // if (isExist) {
    //   practicalSymbol.current = currentSymbol;
    // } else if (practicalSymbol?.current) {
    //   // 当前 symbol 如果不存在，需要判断上一个排序的 symbol
    //   const prevSymbolForIndex = findIndex(data, { symbol: practicalSymbol.current });
    //   if (prevSymbolForIndex === '-1') return data;
    //   currentIndex = prevSymbolForIndex;
    // }

    // 如果找到了该对象
    if (currentIndex !== -1) {
      // 使用 lodash 的 pullAt 方法提取该对象
      const [currentItem] = pullAt(newData, currentIndex);
      // 使用 lodash 的 unshift 方法将该对象插入到数组的第一个位置
      newData.unshift(currentItem);
    }

    return newData;
  }, [currentSymbol, isSettle, oriData]);

  return reorderList;
};

export default useReorderPosition;
