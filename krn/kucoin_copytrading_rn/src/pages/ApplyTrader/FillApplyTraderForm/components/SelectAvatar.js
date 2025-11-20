import {AVATAR_LIST} from 'pages/ProfileSetting/UpdateAvatar/constant';
import React, {memo, useCallback, useEffect, useMemo} from 'react';
import {useWatch} from 'react-hook-form';
import {TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {css} from '@emotion/native';
import {useFocusEffect} from '@react-navigation/native';

import {LongArrowRightIcon} from 'components/Common/SvgIcon';
import {RouterNameMap} from 'constants/router-name-map';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {usePush} from 'hooks/usePush';
import useTracker from 'hooks/useTracker';
import {getUserFlag} from 'utils/user';
import {ApplyTraderGetSelectAvatarManager} from '../helper';
import {
  ChangeText,
  CurrentAvatar,
  CurrentAvatarBoxInnerText,
  CurrentAvatarTextBox,
  CurrentInfo,
} from './styles';

const SelectAvatar = ({control, value, onChange}) => {
  const {_t} = useLang();

  const {push} = usePush();
  const {nickname: userParentNickname, email} =
    useSelector(state => state.app.userInfo) || {};
  const {onClickTrack} = useTracker();

  const nicknameVal =
    useWatch({
      control,
      name: 'nickName',
    }) || userParentNickname;

  useFocusEffect(
    useCallback(() => {
      const rewriteAlreadySelectVal = async () => {
        const selectVal = await ApplyTraderGetSelectAvatarManager.getValue();
        if (value !== selectVal) {
          onChange(selectVal);
        }
      };

      rewriteAlreadySelectVal();
    }, [onChange, value]),
  );

  useEffect(() => {
    return () => {
      ApplyTraderGetSelectAvatarManager.reset();
    };
  }, []);

  const enterApplyTraderSelectAvatarPage = () => {
    onClickTrack({
      blockId: 'avatar',
      locationId: 'changeButton',
    });

    push(RouterNameMap.ApplyTraderSelectAvatarPage, {
      nicknameVal,
      avatarFileId: value,
    });
  };

  const showAvatarText = useMemo(
    () => getUserFlag({nickName: nicknameVal, email}),
    [nicknameVal, email],
  );

  const currentSource = useMemo(
    () => AVATAR_LIST.find(i => i.fileId === value)?.avatarSource,
    [value],
  );

  return (
    <CurrentInfo>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={enterApplyTraderSelectAvatarPage}>
        {value ? (
          <CurrentAvatar source={currentSource} />
        ) : (
          <CurrentAvatarTextBox>
            <CurrentAvatarBoxInnerText>
              {showAvatarText}
            </CurrentAvatarBoxInnerText>
          </CurrentAvatarTextBox>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={enterApplyTraderSelectAvatarPage}>
        <RowWrap
          style={css`
            margin-top: 4px;
          `}>
          <ChangeText>{_t('bed2260a7cdc4000ab5c')}</ChangeText>
          <LongArrowRightIcon opacity={1} />
        </RowWrap>
      </TouchableOpacity>
    </CurrentInfo>
  );
};

export default memo(SelectAvatar);
