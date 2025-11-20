import {useLockFn, useMemoizedFn, useMount} from 'ahooks';
import {usePullSummaryQuery} from 'pages/TraderProfile/hooks/usePullSummaryQuery';
import {useIsShowFollowBtn} from 'pages/TraderProfile/hooks/useVisibilityHandler/useIsShowFollowBtn';
import React, {memo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {css} from '@emotion/native';
import {ThemeProvider as EThemeProvider} from '@emotion/react';
import {showToast} from '@krn/bridge';
import {ThemeProvider} from '@krn/ui';

import shareIc from 'assets/common/ic-share-light.png';
import {ConfirmModal} from 'components/Common/Confirm';
import {useMutation} from 'hooks/react-query';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {useWithLoginFn} from 'hooks/useWithLoginFn';
import {doFollowTrader} from 'services/copy-trade';
import {getNativeInfo} from 'utils/helper';
import {FollowBox, FollowText, ShareBox, ShareImage} from './index.styles';
import {useShareTraderProfile} from './useShareTraderProfile';

const SUCCESS_DELAY_INTERVAL = 300;

const FollowBtnArea = () => {
  const [theme, setTheme] = useState('');
  const {onClickTrack} = useTracker();

  const {data: summaryDataResp, refetch: refetchFollowStatus} =
    usePullSummaryQuery();
  const {followed, uid, nickName, leadConfigId} = summaryDataResp?.data || {};
  const [confirmVisible, setConfirmVisible] = useState(false);
  const {_t} = useLang();
  const closeConfirm = useMemoizedFn(() => setConfirmVisible(false));

  const {mutateAsync} = useMutation({
    mutationFn: async () => {
      await doFollowTrader({
        leadSubUid: uid,
        unFollow: !!followed,
        leadConfigId,
      });
      setTimeout(
        () =>
          showToast(
            !followed ? _t('afe4705f97b44000a81e') : _t('70ce219a75744000a94b'),
          ),
        SUCCESS_DELAY_INTERVAL,
      );
    },
    onSuccess: () => {
      refetchFollowStatus();
    },
    onSettled: () => {
      closeConfirm();
    },
  });

  const doFollowTraderAction = useLockFn(mutateAsync);

  const handleFollowBtn = useMemoizedFn(() => {
    onClickTrack({
      blockId: 'button',
      locationId: 'follow',
      properties: {
        is_follow: followed,
      },
    });

    if (followed) {
      setConfirmVisible(true);
      return;
    }

    doFollowTraderAction();
  });

  const {run: handleFollowBtnWithLogin} = useWithLoginFn(handleFollowBtn);

  useMount(async () => {
    const nativeInfo = await getNativeInfo();
    const {darkMode} = nativeInfo || {};
    setTheme(darkMode ? 'dark' : 'light');
  });

  if (!theme) {
    return null;
  }

  return (
    <>
      <TouchableOpacity activeOpacity={0.8} onPress={handleFollowBtnWithLogin}>
        <FollowBox isFollowed={followed}>
          <FollowText isFollowed={followed}>
            {followed ? _t('1b7bad09e43f4000a792') : _t('a295ed450ece4000ab86')}
          </FollowText>
        </FollowBox>
      </TouchableOpacity>
      <ThemeProvider
        defaultTheme={theme}
        EmotionProviderInstance={EThemeProvider}>
        <ConfirmModal
          title={_t('bb61308c20e04000a845')}
          show={confirmVisible}
          onClose={closeConfirm}
          onOk={doFollowTraderAction}
          onCancel={closeConfirm}
          okText={_t('bhfjS7Y6HXsKuQzsXGDpgQ')}
          cancelText={_t('67cf010eb33b4000a0d1')}
          message={_t('3c07bf508f894000a85d', {
            name: nickName,
          })}
        />
      </ThemeProvider>
    </>
  );
};

export const FollowActionArea = memo(({status}) => {
  const {onShare, isFetched} = useShareTraderProfile();
  const isShowFollowBtn = useIsShowFollowBtn({status});

  return (
    <>
      <View style={css('flex-direction: row;align-items: center')}>
        {isFetched && (
          <TouchableOpacity activeOpacity={0.8} onPress={onShare}>
            <ShareBox>
              <ShareImage source={shareIc} />
            </ShareBox>
          </TouchableOpacity>
        )}

        {isShowFollowBtn && <FollowBtnArea />}
      </View>
    </>
  );
});
