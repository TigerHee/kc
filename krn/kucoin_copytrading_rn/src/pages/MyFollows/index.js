import React from 'react';
import {Empty} from '@krn/ui';

import Header from 'components/Common/Header';
import {MyFollowsFlatListWrap, MyFollowsPage, styles} from './styles';
import UserInfoItem from './UserInfoItem';

const MyFollows = () => {
  const data = [{}, {}, {}];

  return (
    <MyFollowsPage>
      <Header title={'我的关注'} />

      {!data?.length ? (
        <Empty
          styles={{
            emptyText: styles.emptyText,
            emptyBox: styles.emptyBox,
          }}
          text="No records"
        />
      ) : (
        <MyFollowsFlatListWrap
          initialNumToRender={5}
          scrollEventThrottle={200}
          showsVerticalScrollIndicator={false}
          data={data}
          ItemSeparatorComponent={() => null}
          分隔线
          keyExtractor={(item, index) => index.toString()}
          renderItem={({_item}) => <UserInfoItem />}
        />
      )}
    </MyFollowsPage>
  );
};

export default MyFollows;
