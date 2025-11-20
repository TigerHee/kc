import React, {memo} from 'react';
import {css} from '@emotion/native';

import {RowWrap} from 'constants/styles';
import {RowAroundWrap, TraderName, TraderNameWrap} from './styles';
import UserAvatar from './UserAvatar';

const UserInfoBar = props => {
  const {children, styles, userInfo, renderName, onPress = () => {}} = props;
  const {nickName, nickname} = userInfo || {};

  const {
    card = {},
    name: nameStyle,
    avatar = {},
    avatarText = {},
    avatarTextBox = {},
  } = styles || {};

  return (
    <RowAroundWrap style={card} onPress={onPress}>
      <RowWrap
        style={css`
          flex: 1;
        `}>
        <UserAvatar
          userInfo={userInfo}
          styles={{
            avatar,
            avatarText,
            avatarTextBox,
          }}
        />

        {renderName && renderName(nickName || nickname)}
        {!renderName && (
          <TraderNameWrap>
            <TraderName style={nameStyle} numberOfLines={1}>
              {nickName || nickname}
            </TraderName>
          </TraderNameWrap>
        )}
      </RowWrap>
      {children}
    </RowAroundWrap>
  );
};

export default memo(UserInfoBar);
