/**
 * Owner: willen@kupotech.com
 */
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import styled from '@emotion/native';
import Item from './CurrentItem';
import {useDispatch, useSelector} from 'react-redux';
import {Loading} from '@krn/ui';
import ListBottomLine from '../Common/ListBottomLine';
import Empty from '../Common/Empty';
import useLang from 'hooks/useLang';

const Wrapper = styled.View`
  padding: 0 16px 0;
  flex: 1;
`;
const StyledLoading = styled(Loading)`
  margin: 200px auto;
`;

export default () => {
  const loading = useSelector(
    state => state.loading.effects['order/queryCurrentOrders'],
  );
  const [page, setPage] = useState(1);
  const [toBottom, setToBottom] = useState(false);
  const dispatch = useDispatch();

  const currentPageIndex = useSelector(state => state.order.currentPageIndex);
  const currentTotalPage = useSelector(state => state.order.currentTotalPage);
  const currentList = useSelector(state => state.order.currentList) || [];

  const {_t} = useLang();

  const getData = index => {
    dispatch({type: 'order/queryCurrentOrders', payload: {pageIndex: index}});
  };

  useEffect(() => {
    getData(1);
  }, []);

  /**
   * 刷新当前和历史
   */
  const handleFresh = () => {
    getData(1);
    dispatch({type: 'order/queryLimitOrders', payload: {pageIndex: 1}});
  };

  const onEndReached = () => {
    if (currentTotalPage > currentPageIndex && !loading) {
      getData(currentPageIndex + 1);
      setPage(currentPageIndex + 1);
    } else {
      setToBottom(true);
    }
  };
  return (
    <Wrapper>
      {loading && page === 1 ? (
        <StyledLoading spin={loading} />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            page === currentTotalPage &&
            toBottom &&
            currentList.length !== 0 ? (
              <ListBottomLine />
            ) : null
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={<Empty text={_t('uxzDn2FZKZDGux3kFdoB91')} />}
          data={currentList}
          renderItem={({item}) => {
            return <Item info={item} onFresh={handleFresh} />;
          }}
          keyExtractor={(item, index) => item.tickerId || index}
        />
      )}
    </Wrapper>
  );
};
