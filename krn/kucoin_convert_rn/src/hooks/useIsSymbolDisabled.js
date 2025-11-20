/*
 * @owner: borden@kupotech.com
 * @desc: 获取当前交易对是否禁用状态
 */
import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {checkSymbolIsDisabled} from 'utils/helper';

export default function useIsSymbolDisabled() {
  const orderType = useSelector(state => state.convert.orderType);
  const matchCoinsMap = useSelector(state => state.convert.matchCoinsMap);
  const symbol = useSelector(state => {
    const {from = {}, to = {}} = state.convert;
    const pair = [from.coin, to.coin];
    // 保证两个币种反转时得到同一个交易对
    return pair.every(Boolean) ? pair.sort().join('-') : '';
  });

  return useMemo(() => {
    return checkSymbolIsDisabled({
      symbol,
      orderType,
      matchCoinsMap,
    });
  }, [matchCoinsMap, orderType, symbol]);
}
