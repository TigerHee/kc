/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'dva';
import InvestItem from './InvestItem';
import InvestDetail from './InvestDetail';
import useTicker from 'Bot/hooks/useTicker';
import { dropOthers } from 'SmartTrade/util';
import { times100 } from 'Bot/helper';
import Spin from '@mui/Spin';

const sorter = {
  dailyChangeRate: (a, b) => a.dailyChangeRate - b.dailyChangeRate,
  weeklyChangeRate: (a, b) => a.weeklyChangeRate - b.weeklyChangeRate,
  monthlyChangeRate: (a, b) => a.monthlyChangeRate - b.monthlyChangeRate,
};
const sortHandle = (composeLists, activeSort) => {
  const { key, sort } = activeSort ?? {};
  if (!key || sort === 'none') {
    return composeLists;
  }
  const sortHandler = sorter[key];
  return composeLists.sort((a, b) => (sort === 'up' ? sortHandler(a, b) : sortHandler(b, a)));
};

export default React.memo(({ changeTab }) => {
  const detailRef = useRef();
  const dispatch = useDispatch();
  const composeLists = useSelector((state) => state.smarttrade.composeLists);
  const activeSort = useSelector((state) => state.smarttrade.createSort);
  const composeListsSort = sortHandle(composeLists, activeSort);
  const fresh = useCallback(() => {
    dispatch({
      type: `smarttrade/getInvestCompose`,
    });
  }, []);
  useTicker(fresh, { isTriggerByLogin: false });

  const onCreate = (item) => {
    // 填充参数
    dispatch({
      type: 'smarttrade/setComposePosition',
      payload: {
        targets: item?.positionTargets?.map((coin) => {
          return {
            currency: coin.currency,
            value: times100(coin.percent),
          };
        }), // 目标仓位
        percentType: item.percentType, // 配比模式
        method: dropOthers(item.changeMethod), // 调仓方式
        from: 'compose',
      },
    });
    changeTab(1);
  };
  return (
    <>
      <Spin spinning={!composeListsSort.length} size="xsmall">
        {composeListsSort.map((item) => {
          return <InvestItem onCreate={onCreate} key={item.id} item={item} detailRef={detailRef} />;
        })}
      </Spin>

      <InvestDetail onCreate={onCreate} detailRef={detailRef} />
    </>
  );
});
