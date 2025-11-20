/**
 * Owner: willen@kupotech.com
 */
import {FlatList} from 'react-native';
import React from 'react';
import styled from '@emotion/native';
import CoinItem from './CoinItem';
import ListHeader from './ListHeader';
import {Loading} from '@krn/ui';
import useLang from 'hooks/useLang';
import ListBottomLine from '../../ListBottomLine';
import Empty from '../../Empty';

const Wrapper = styled.View`
  padding-bottom: 16px;
  flex: 1;
`;

const StyledLoading = styled(Loading)`
  margin: 200px auto;
`;
export default props => {
  const {_t} = useLang();
  const {
    type = 'history',
    list = [],
    handleSelect,
    handleDelete,
    loading = false,
    showBalance,
    marginMarkMap,
    keywords,
    orderHotsList,
    commonSelectedList,
  } = props;

  return (
    <Wrapper>
      {loading ? (
        <StyledLoading spin={loading} />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Empty text={_t('uxzDn2FZKZDGux3kFdoB91')} />}
          data={list}
          ListFooterComponent={list.length ? <ListBottomLine /> : null}
          ListHeaderComponent={
            type === 'history' ? null : (
              <ListHeader
                showBalance={showBalance}
                orderHotsList={orderHotsList}
                commonSelectedList={commonSelectedList}
                handleSelect={(item, index) => handleSelect(item, index)}
                handleDelete={handleDelete}
              />
            )
          }
          renderItem={({item, index}) => {
            return (
              <CoinItem
                showBalance={showBalance}
                type={type}
                info={item}
                handleSelect={() => {
                  handleSelect(item, index);
                }}
                marginMark={marginMarkMap[item.coin]}
                keywords={keywords}
              />
            );
          }}
          keyExtractor={(item, index) => item.coin || index}
        />
      )}
    </Wrapper>
  );
};
