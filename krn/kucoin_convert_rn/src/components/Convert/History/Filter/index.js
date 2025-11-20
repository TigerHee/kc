/**
 * Owner: willen@kupotech.com
 */
import React, {useEffect} from 'react';
import styled from '@emotion/native';
import CoinFilter from './Coin';
import TimeFilter from './Time';
import StatusFilter from './Status';
import Btns from './Btns';
import useLang from 'hooks/useLang';
import {useDispatch, useSelector} from 'react-redux';
// import {useWindowDimensions} from 'react-native';
import ActionSheet from 'components/Common/ActionSheet';

const Content = styled.View`
  /* padding: 8px 0 0; */
  margin: 0 16px;
  position: relative;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  line-height: 23.4px;
  margin: 0 16px 24px;
  color: ${({theme}) => theme.colorV2.text};
`;

export default ({params = {}, setShowFilter, show, tab}) => {
  const {_t} = useLang();
  const dispatch = useDispatch();
  const filters = useSelector(state => state.order.filters);
  const historyOrderType = useSelector(state => state.order.historyOrderType);
  // const screenHeight = Math.round(useWindowDimensions().height);
  const isLimit = historyOrderType === 'LIMIT';
  //选择币种
  useEffect(() => {
    if (params.direction === 'from') {
      const _filters = {
        ...filters,
        fromCurrency: params.coinSelected,
        toCurrency:
          filters.toCurrency === params.coinSelected ? '' : filters.toCurrency, //from和to的币种一样，to的币种清除掉
      };

      dispatch({
        type: 'order/update',
        payload: {
          filters: _filters,
        },
      });
    } else if (params.direction === 'to') {
      const _filters = {
        ...filters,
        toCurrency: params.coinSelected,
        fromCurrency:
          filters.fromCurrency === params.coinSelected
            ? ''
            : filters.fromCurrency,
      };

      dispatch({
        type: 'order/update',
        payload: {
          filters: _filters,
        },
      });
    }
  }, [params]);

  //选择时间
  const onPressTime = time => {
    dispatch({
      type: 'order/update',
      payload: {filters: {...filters, ...time?.value}, timeFilters: time.id},
    });
  };

  //选择状态
  const onPressStatus = status => {
    dispatch({
      type: 'order/update',
      payload: {filters: {...filters, status}},
    });
  };

  //确认
  const handleConfirm = () => {
    // dispatch({type: 'order/update', payload: {list: []}});
    const action = isLimit ? 'queryLimitOrders' : 'queryMarketOrders';
    dispatch({type: `order/${action}`, payload: {pageIndex: 1}});
    setShowFilter(false);
  };

  //重置
  const handleReset = () => {
    dispatch({
      type: 'order/reset',
      payload: {clearList: true},
    });

    const action = isLimit ? 'queryLimitOrders' : 'queryMarketOrders';
    dispatch({type: `order/${action}`, payload: {pageIndex: 1}});
    setShowFilter(false);
  };

  return (
    <ActionSheet
      id="filter"
      // title={_t('88TvPJLbNBsoDNAZbdUZzk')}
      show={show}
      headerType="native"
      header={<></>}
      onClose={() => {
        setShowFilter(false);
      }}>
      <Title>{_t('88TvPJLbNBsoDNAZbdUZzk')}</Title>
      <Content contentContainerStyle={{flexGrow: 1}} overScrollMode="auto">
        <CoinFilter
          fromCoin={filters.fromCurrency}
          toCoin={filters.toCurrency}
          onPress={() => setShowFilter(false)}
          tab={tab}
        />
        <TimeFilter onPressTime={onPressTime} />
        <StatusFilter onPressStatus={onPressStatus} />
      </Content>
      <Btns handleConfirm={handleConfirm} handleReset={handleReset} />
    </ActionSheet>
  );
};
