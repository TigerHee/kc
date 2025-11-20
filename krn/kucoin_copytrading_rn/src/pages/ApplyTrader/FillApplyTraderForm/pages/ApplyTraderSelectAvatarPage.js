import {useSetState} from 'ahooks';
import ProfileSettingPageLayout from 'pages/ProfileSetting/components/ProfileSettingPageLayout';
import {AVATAR_LIST} from 'pages/ProfileSetting/UpdateAvatar/constant';
import SelectAvatarContent from 'pages/ProfileSetting/UpdateAvatar/SelectAvatarContent';
import React from 'react';

import Button from 'components/Common/Button';
import useGoBack from 'hooks/useGoBack';
import useLang from 'hooks/useLang';
import {useParams} from 'hooks/useParams';
import {usePreloadImages} from 'hooks/usePreloadImages';
import {ApplyTraderGetSelectAvatarManager} from '../helper';
const fileImgList = AVATAR_LIST.map(i => i.avatarSource);
export const ApplyTraderSelectAvatarPage = () => {
  // 预拉取图像
  usePreloadImages(fileImgList);
  const goBack = useGoBack();
  const {_t} = useLang();

  const {nicknameVal, avatarFileId} = useParams();
  const [formValue, updateFormValue] = useSetState(() => ({
    avatar: avatarFileId,
  }));

  const onSaveToBackFillPage = async () => {
    // 跨页面通信 记录选中头像 fileId
    await ApplyTraderGetSelectAvatarManager.setValue(formValue.avatar);
    goBack();
  };

  return (
    <ProfileSettingPageLayout
      content={
        <SelectAvatarContent
          avatar={avatarFileId}
          nickName={nicknameVal}
          value={formValue.avatar}
          onChange={val => updateFormValue({avatar: val})}
        />
      }
      footer={
        <Button onPress={onSaveToBackFillPage}>
          {_t('74584193cddd4000a5d9')}
        </Button>
      }
    />
  );
};
