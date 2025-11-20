import {useMemoizedFn} from 'ahooks';
import React, {memo} from 'react';

import UserInfoBar from 'components/copyTradeComponents/UserInfo/UserInfoBar';
import useLang from 'hooks/useLang';
import {useParams} from 'hooks/useParams';
import useTracker from 'hooks/useTracker';
import FollowConfirm from './components/FollowConfirm';
import RightCancelFollowBtn from './components/RightCancelFollowBtn';
import {useClick} from './hooks/useClick';
import {useGetFormSceneStatus} from './hooks/useGetFormSceneStatus';
import {useInitForm} from './hooks/useInitForm';
import {usePullBasicData} from './hooks/usePullBasicData';
import {useSettingSceneAndTabHelper} from './hooks/useSettingSceneAndTabHelper';
import {convertTraderInfo2UserInfo} from './presenter/helper';
import {useMakeStyles} from './makeStyles';
import SceneLayout from './SceneLayout';
import {
  FixedBottomArea,
  SettingContainer,
  StyledHeader,
  StyledSubmitBtn,
} from './styles';
const FollowSetting = () => {
  const {userInfoStyles} = useMakeStyles();
  const {availableBalance, traderInfo} = usePullBasicData();
  const {leadConfigId} = useParams();
  const {_t} = useLang();
  const {setTabIndex, tabValue} = useSettingSceneAndTabHelper();
  const {onClickTrack} = useTracker();
  const {isReadonly} = useGetFormSceneStatus();
  const {
    handleSubmit,
    formMethods,
    fixedAmountFormMethods,
    fixedRateFormMethods,
    isCancelOrClose,
  } = useInitForm({
    availableBalance,
    tabValue,
  });

  const {followConfirmRef, submitFollowConfig, isLoading} = useClick({
    tabValue,
    leadBizNo: leadConfigId,
    formMethods,
  });
  const handleChangeTab = useMemoizedFn(idx => {
    onClickTrack({
      blockId: idx === 0 ? 'ratio' : 'amount',
      locationId: 'tabClick',
    });

    setTabIndex(idx);
  });

  return (
    <>
      <SettingContainer>
        <StyledHeader
          title={_t('98e791d16dc04000a4b7')}
          rightSlot={<RightCancelFollowBtn />}
        />

        <SceneLayout
          fixedRateFormMethods={fixedRateFormMethods}
          fixedAmountFormMethods={fixedAmountFormMethods}
          bannerNode={
            <UserInfoBar
              userInfo={convertTraderInfo2UserInfo(traderInfo)}
              styles={userInfoStyles}
            />
          }
          handleChangeTab={handleChangeTab}
        />
        {/* // 已经撤销或者关闭时不展示 */}
        {!!handleSubmit && !isCancelOrClose && (
          <FixedBottomArea>
            <StyledSubmitBtn
              loading={isLoading}
              onPress={handleSubmit(submitFollowConfig)}>
              {_t(isReadonly ? 'c2689e59e4ce4000acb7' : 'c460ad39377c4000a44f')}
            </StyledSubmitBtn>
          </FixedBottomArea>
        )}
      </SettingContainer>

      <FollowConfirm
        ref={followConfirmRef}
        userInfo={convertTraderInfo2UserInfo(traderInfo)}
      />
    </>
  );
};

export default memo(FollowSetting);
