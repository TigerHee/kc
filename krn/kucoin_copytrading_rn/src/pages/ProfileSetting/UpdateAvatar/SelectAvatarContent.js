import React, {memo, useMemo} from 'react';
import {useSelector} from 'react-redux';

import useLang from 'hooks/useLang';
import {makeGroupArrayByFillNull} from 'utils/helper';
import {getUserFlag} from 'utils/user';
import {
  AvatarContent,
  AvatarRowWarp,
  Box,
  CurrentAvatar,
  CurrentAvatarBoxInnerText,
  CurrentAvatarTextBox,
  CurrentInfo,
  CurrentOuterName,
  Desc,
  Title,
} from '../styles';
import {SingleAvatar} from './AvatarBox';
import {AVATAR_LIST, Nick_NAME_TEXT_AVATAR_ITEM} from './constant';

const RowLength = 4;

const canSelectAvatarGroups = makeGroupArrayByFillNull(
  [...AVATAR_LIST, Nick_NAME_TEXT_AVATAR_ITEM],
  RowLength,
);

const SelectAvatarContent = ({onChange, value, nickName = '-'}) => {
  const currentSource = AVATAR_LIST.find(i => i.fileId === value)?.avatarSource;
  const {email} = useSelector(state => state.app.userInfo) || {};
  const {_t} = useLang();
  const showAvatarText = useMemo(
    () => getUserFlag({nickName, email}),
    [nickName, email],
  );

  return (
    <Box>
      <Title>{_t('1c1de9c659d74000acd7')}</Title>

      <CurrentInfo>
        {currentSource ? (
          <CurrentAvatar source={currentSource} />
        ) : (
          <CurrentAvatarTextBox>
            <CurrentAvatarBoxInnerText>
              {getUserFlag({nickName, email})}
            </CurrentAvatarBoxInnerText>
          </CurrentAvatarTextBox>
        )}
        {!!showAvatarText && (
          <CurrentOuterName>{showAvatarText}</CurrentOuterName>
        )}
      </CurrentInfo>

      <Desc>{_t('47fb8144c2db4000a047')}</Desc>

      <AvatarContent>
        {canSelectAvatarGroups.map((avatarGroup, groupIdx) => {
          return (
            <AvatarRowWarp key={groupIdx}>
              {avatarGroup?.map(i => (
                <SingleAvatar
                  value={value}
                  key={i?.avatarIndex || 'textAvatar'}
                  onChange={onChange}
                  showAvatarText={showAvatarText}
                  avatarItem={i}
                />
              ))}
            </AvatarRowWarp>
          );
        })}
      </AvatarContent>
    </Box>
  );
};

export default memo(SelectAvatarContent);
