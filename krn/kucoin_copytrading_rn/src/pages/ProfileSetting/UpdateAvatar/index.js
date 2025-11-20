import {usePullMyLeaderDetailQuery} from 'pages/TraderProfile/hooks/usePullMyLeaderDetailQuery';
import React, {memo} from 'react';
import {useForm} from 'react-hook-form';
import {css} from '@emotion/native';

import Field from 'components/Common/Form/Field';
import Form from 'components/Common/Form/Form';
import {usePreloadImages} from 'hooks/usePreloadImages';
import {Loading} from '../components/Loading';
import ProfileSettingPageLayout from '../components/ProfileSettingPageLayout';
import SaveButton from '../components/SaveButton';
import {AVATAR_LIST} from './constant';
import SelectAvatarContent from './SelectAvatarContent';

const fileImgList = AVATAR_LIST.map(i => i.avatarSource);

const UpdateAvatar = () => {
  const {data: leaderDetailResp, isLoading} = usePullMyLeaderDetailQuery({
    refetchOnFocus: false,
  });
  const {avatar, nickName} = leaderDetailResp?.data || {};
  const curAvatarFileId = AVATAR_LIST?.find(i => i.uri === avatar)?.fileId;
  usePreloadImages(fileImgList);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      avatar: curAvatarFileId,
    },
  });
  const formAvatarValue = formMethods.watch('avatar');

  const curHasAvatarAndNoFileId = !curAvatarFileId && avatar;
  const disabledSubmit = curHasAvatarAndNoFileId && !formAvatarValue;

  return (
    <ProfileSettingPageLayout
      content={
        isLoading ? (
          <Loading />
        ) : (
          <Form
            style={css`
              flex: 1;
            `}
            formMethods={formMethods}>
            <Field name={'avatar'}>
              {register => (
                <SelectAvatarContent
                  {...register}
                  avatar={avatar}
                  nickName={nickName}
                />
              )}
            </Field>
          </Form>
        )
      }
      footer={
        <SaveButton disabled={disabledSubmit} formMethods={formMethods} />
      }
    />
  );
};

export default memo(UpdateAvatar);
