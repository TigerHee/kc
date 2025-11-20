/*
 * owner: Clyne@kupotech.com
 */
import React, { useRef } from 'react';
import { useSelector } from 'dva';
import Spin from '@mui/Spin';
import VirtualizedList from '@/components/VirtualizedList';
import Empty from '@mui/Empty';
import Item from './Item';
import { namespace } from '../config';
import { useGetCurrentSymbol } from 'src/trade4.0/hooks/common/useSymbol';
// 这里不能执行hooks，有点辣鸡
const renderRow = (props) => {
  return <Item {...props} />;
};

const loop = [];
const List = () => {
  const ref = useRef();
  const currentSymbol = useGetCurrentSymbol();
  const data = useSelector((state) => state[namespace].data[currentSymbol] || loop);
  const isLoading = useSelector((state) => state.loading.effects[`${namespace}/getRecentTrade`]);
  if (isLoading) {
    return <Spin className="loading-trade" />;
  }
  return (
    <div className="recent-list" data-inspector="trade-recentTrade-content">
      {data.length === 0 ? (
        <Empty />
      ) : (
        <VirtualizedList
          ref={ref}
          length={data.length}
          itemHeight={24}
          render={({ index, style }) => renderRow({ style, data: data[index], index })}
        />
      )}
    </div>
  );
};

export default List;
