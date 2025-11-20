import React, {memo} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';
import {Button} from '@krn/ui';

import followBtnIcon from 'assets/follow/follow-btn-right-ic.png';
import {commonStyles} from 'constants/styles';
import {
  Avatar,
  DescLine,
  FollowBtnIconImg,
  InfoWrap,
  PersonDescText,
  TraderName,
  UserInfoItemWrap,
} from './styles';

const UserInfoItem = () => {
  return (
    <UserInfoItemWrap>
      <Avatar />
      <InfoWrap>
        <TraderName>Darrell Steward</TraderName>
        <View style={commonStyles.flexRowCenter}>
          <PersonDescText>11.7k 粉丝</PersonDescText>
          <DescLine />
          <PersonDescText>2 已关注</PersonDescText>
        </View>
      </InfoWrap>
      <Button
        size="small"
        type="secondary"
        icon={<FollowBtnIconImg source={followBtnIcon} />}
        style={css`
          margin-left: auto;
        `}>
        Followed
      </Button>
    </UserInfoItemWrap>
  );
};

export default memo(UserInfoItem);
