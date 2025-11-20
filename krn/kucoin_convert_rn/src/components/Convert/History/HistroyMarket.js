/**
 * Owner: willen@kupotech.com
 */
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import styled from '@emotion/native';
import Item from './HistoryItem';
import {useDispatch, useSelector} from 'react-redux';
import {Loading} from '@krn/ui';
import ListBottomLine from '../Common/ListBottomLine';
import Empty from '../Common/Empty';
import useLang from 'hooks/useLang';
import HistoryTitle from './HistoryTitle';

const StyledLoading = styled(Loading)`
  margin: 200px auto;
`;

export default () => {
  const loading = useSelector(
    state => state.loading.effects['order/queryMarketOrders'],
  );
  const [page, setPage] = useState(1);
  const [toBottom, setToBottom] = useState(false);
  const dispatch = useDispatch();

  const pageIndex = useSelector(state => state.order.pageIndex);
  const totalPage = useSelector(state => state.order.totalPage);
  const list = useSelector(state => state.order.list) || [];
  const marketFirstPageLoading = useSelector(
    state => state.order.marketFirstPageLoading,
  );

  const {_t} = useLang();
  const getData = index => {
    dispatch({type: 'order/queryMarketOrders', payload: {pageIndex: index}});
  };

  useEffect(() => {
    getData(1);
  }, []);

  const onEndReached = () => {
    if (totalPage > pageIndex && !loading) {
      getData(pageIndex + 1);
      setPage(pageIndex + 1);
    } else {
      setToBottom(true);
    }
  };

  return (
    <>
      {list.length === 0 ? null : <HistoryTitle />}

      {marketFirstPageLoading ? (
        <StyledLoading spin={loading} />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            page === totalPage && toBottom && list.length !== 0 ? (
              <ListBottomLine />
            ) : null
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={<Empty text={_t('uxzDn2FZKZDGux3kFdoB91')} />}
          data={list}
          renderItem={({item}) => {
            return <Item info={item} type="market" />;
          }}
          keyExtractor={(item, index) => item.tickerId || index}
        />
      )}
    </>
  );
};
