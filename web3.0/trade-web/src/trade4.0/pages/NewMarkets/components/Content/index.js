/*
 * @Owner: Clyne@kupotech.com
 */
import React from 'react';
import Header from './Header';
import { ContentWrapper } from './style';
import List from './List';
import SearchALLList from './SearchALLList';

const Content = () => {
  return (
    <ContentWrapper className="market-content">
      <Header />
      <List />
      <SearchALLList />
    </ContentWrapper>
  );
};

export default Content;
