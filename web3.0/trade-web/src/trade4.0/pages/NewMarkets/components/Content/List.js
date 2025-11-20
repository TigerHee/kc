/*
 * @Owner: Clyne@kupotech.com
 */
import React, { memo } from 'react';
import { useSelector, shallowEqual } from 'dva';
import { namespace } from '../../config';
import Table from '@/components/VirtualizedTable';
import { useListScroll, useNext } from './hooks/useList';
import EmptyContent from './EmptyContent';
import Item from './Item';
import { useTabType } from './hooks/useType';
import Loading from './Loading';

const List = () => {
  const data = useSelector((state) => state[namespace].data);
  const {
    coinSort: _coinSort,
    pairSort: _pairSort,
    lastPriceSort: _lastPriceSort,
    changeSort: _changeSort,
  } = useSelector((state) => {
    const { coinSort, pairSort, lastPriceSort, changeSort } = state[namespace];
    return { coinSort, pairSort, lastPriceSort, changeSort };
  }, shallowEqual);
  const { isSearchAll, listType } = useTabType();
  const keyType = `${listType}-${_coinSort}-${_pairSort}-${_lastPriceSort}-${_changeSort}`;
  const { pullNext, tablePagination } = useNext();

  const { setScroll, renderChange } = useListScroll();
  // search
  if (isSearchAll) {
    return <></>;
  }
  if (data === 'updating') {
    return <Loading />;
  }
  if (data.length === 0) {
    return <EmptyContent />;
  }

  return (
    <div className="market-list">
      <Table
        key={keyType}
        data={data}
        requestCallback={pullNext}
        pagination={tablePagination}
        needHeader={false}
        isScrolling={(isScroll) => {
          setScroll(isScroll);
        }}
        rangeChanged={renderChange}
        rowRender={(item, index) => {
          const { symbolCode, baseCurrency, subCategory } = item;
          const keyId = symbolCode + baseCurrency + subCategory + index;
          return <Item key={keyId} {...item} />;
        }}
      />
    </div>
  );
};

export default memo(List);
