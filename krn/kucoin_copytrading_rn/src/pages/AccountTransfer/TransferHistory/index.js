import React from 'react';

import FlatList from 'components/FlatList';
import useLang from 'hooks/useLang';
import {usePullBalanceHistory} from '../hooks/usePullBalanceHistory';
import RecordItem from './RecordItem';
import {Container, StyledHeader} from './styles';

const AccountTransferHistory = () => {
  const {data, loading} = usePullBalanceHistory();
  const {_t} = useLang();

  return (
    <Container>
      <StyledHeader title={_t('8d124fe7ece04000aaa1')} />
      <FlatList
        loading={loading}
        initialNumToRender={5}
        scrollEventThrottle={200}
        showsVerticalScrollIndicator={false}
        data={data || []}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({item}) => <RecordItem info={item} />}
        ListHeaderComponent={null}
        //1期暂无筛选
        // ListHeaderComponent={<FilterBar />}
      />
    </Container>
  );
};

export default AccountTransferHistory;
