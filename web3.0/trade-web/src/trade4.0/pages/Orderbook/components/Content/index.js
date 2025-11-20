/*
 * owner: Clyne@kupotech.com
 */
import React, { useContext } from 'react';
import { useSelector } from 'dva';
import {
  namespace,
  ORDER_BOOK_SELL,
  ORDER_BOOK_BUY,
  WrapperContext,
} from '@/pages/Orderbook/config';
import { getModelList } from '@/pages/Orderbook/hooks/useModelData';
import List from '../List';
import Bar from '../Bar';
import Header from '../List/Header';
import { ContentWrapper } from './style';

const SellList = () => {
  const sell = getModelList('sell');
  const activeSell = useSelector((state) => state[namespace].activeOrders.sell);
  return (
    <ContentWrapper className="orderbook-content">
      <Header showHeader display="outer" />
      <List data={sell} active={activeSell} type={ORDER_BOOK_SELL} showHeader />
      <Bar />
    </ContentWrapper>
  );
};

const BuyList = () => {
  const buy = getModelList('buy');
  const activeBuy = useSelector((state) => state[namespace].activeOrders.buy);
  return (
    <ContentWrapper className="orderbook-content">
      <Header showHeader display="outer" />
      <Bar />
      <List data={buy} active={activeBuy} type={ORDER_BOOK_BUY} showHeader />
    </ContentWrapper>
  );
};

const BuyAndSellList = () => {
  const { buy, sell } = getModelList();
  // md断点的时候需要显示header
  const screen = useContext(WrapperContext);
  const { sell: activeSell, buy: activeBuy } = useSelector(
    (state) => state[namespace].activeOrders,
  );
  return (
    <ContentWrapper className="orderbook-content">
      <Header showHeader display="outer" />
      <List data={sell} active={activeSell} type={ORDER_BOOK_SELL} showHeader />
      <Bar />
      <List
        data={buy}
        active={activeBuy}
        type={ORDER_BOOK_BUY}
        showHeader={screen === 'md'}
      />
    </ContentWrapper>
  );
};

const Content = () => {
  const type = useSelector((state) => state[namespace].type);
  const screen = useContext(WrapperContext);
  if (screen !== 'sm') {
    return <BuyAndSellList />;
  }
  if (type === ORDER_BOOK_SELL) {
    return <SellList />;
  }
  if (type === ORDER_BOOK_BUY) {
    return <BuyList />;
  }

  return <BuyAndSellList />;
};

export default Content;
