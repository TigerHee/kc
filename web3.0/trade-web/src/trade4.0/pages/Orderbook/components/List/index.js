/*
 * owner: Clyne@kupotech.com
 */
import React, { useRef, useMemo, Fragment, useContext } from 'react';
import { useSelector } from 'dva';
import VirtualizedList from '@/components/VirtualizedList';
import Empty from '@mui/Empty';
import Item from './Item';
import Header from './Header';
import { useList } from '@/pages/Orderbook/components/List/hooks/useList';
import Spin from '@mui/Spin';
import { ListWrapper, ListContent } from './style';
import { namespace, ORDER_BOOK_SELL, WrapperContext } from '../../config';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { reverse } from 'lodash';

// 这里不能执行hooks，有点辣鸡
const renderRow = (props) => {
  const { type, length, index } = props;
  let rowKey = `${index}`;
  // 卖盘是从下往上的
  if (type === 'sell') {
    rowKey = `${length - index - 1}`;
  }
  return <Item key={rowKey} {...props} />;
};

const List = ({ type, data: _data, showHeader, active }) => {
  const ref = useRef();
  const screen = useContext(WrapperContext);
  const isCombineSell = screen !== 'sm' && type === ORDER_BOOK_SELL;
  const isLoading = useSelector((state) => state.loading.effects[`${namespace}/getOrderBooks`]);
  const currenctSymbol = useGetCurrentSymbol();
  const hasData = useSelector((state) => !!state[namespace].data[currenctSymbol]);

  const data = useMemo(() => {
    // 并排模式的卖盘采用正序处理
    if (isCombineSell) {
      // 断开引用链，避免操作到dva的原始state
      return reverse([].concat(_data));
    }
    return _data;
  }, [_data, isCombineSell]);

  const { onMouseLeave, onMouseOver, activeIndexs, length } = useList({
    ref,
    type,
    active,
    data,
    isCombineSell,
  });

  if (!hasData && isLoading) {
    return (
      <Fragment>
        <ListWrapper className="loading" key="loading">
          <Spin />
        </ListWrapper>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <ListWrapper
        className={`orderbook-list-${type}`}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        data-inspector="trade-orderbook-list"
      >
        <Header type={type} showHeader={showHeader} display="inner" />
        {length === 0 ? (
          <Empty />
        ) : (
          <ListContent>
            <VirtualizedList
              ref={ref}
              notfilledClass="orderbook-notfilled"
              length={length}
              itemHeight={24}
              render={({ index, style }) =>
                renderRow({
                  style,
                  type,
                  data: data[index],
                  index,
                  length,
                  activeIndexs,
                })
              }
            />
          </ListContent>
        )}
      </ListWrapper>
    </Fragment>
  );
};

export default List;
