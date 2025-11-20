import React, {memo} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import clockIc from 'assets/common/ic-clock.png';
import NumberFormat from 'components/Common/NumberFormat';
import {Number} from 'components/Common/UpOrDownNumber';
import {RowWrap} from 'constants/styles';
import {UserAvatar} from '../UserInfo';
import {
  AmountWrap,
  CardWarp,
  NoColumnWrap,
  NoText,
  SecondaryText,
  Text,
  TimeIcon,
  userInfoStyles,
} from './styles';

const UserAndAmountCard = props => {
  const {
    no = '-',
    avatar,
    firstLineAmount,
    userName,
    time,
    copyPrincipal,
  } = props;

  return (
    <CardWarp>
      <NoColumnWrap>
        <NoText>{no}</NoText>
      </NoColumnWrap>

      <UserAvatar
        styles={userInfoStyles}
        userInfo={{
          avatarUrl: avatar,
          nickName: userName,
        }}
      />

      <View
        style={css`
          margin-left: 8px;
        `}>
        <Text>{userName}</Text>
        <RowWrap
          style={css`
            margin-top: 2px;
          `}>
          <TimeIcon source={clockIc} />
          <SecondaryText>{time}</SecondaryText>
        </RowWrap>
      </View>

      <AmountWrap>
        <Number
          style={css`
            font-weight: 500;
          `}
          isProfitNumber>
          {firstLineAmount}
        </Number>

        <SecondaryText
          style={css`
            margin-top: 2px;
          `}>
          <NumberFormat isAumNumber>{copyPrincipal}</NumberFormat>
        </SecondaryText>
      </AmountWrap>
    </CardWarp>
  );
};

export default memo(UserAndAmountCard);
