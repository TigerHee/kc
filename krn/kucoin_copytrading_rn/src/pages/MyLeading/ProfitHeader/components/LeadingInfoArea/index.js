import {useMemoizedFn} from 'ahooks';
import {useGotoTransfer} from 'pages/MyLeading/hooks/useGotoTransfer';
import React, {memo, useCallback, useMemo} from 'react';
import {TouchableOpacity} from 'react-native';
import {css} from '@emotion/native';

import Button from 'components/Common/Button';
import {LongArrowRightIcon} from 'components/Common/SvgIcon';
import UserInfoBar from 'components/copyTradeComponents/UserInfo/UserInfoBar';
import {validateLeaderConfigHelper} from 'constants/businessType';
import {RowWrap} from 'constants/styles';
import {useGotoProfit} from 'hooks/copyTrade/useGotoProfit';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {useLaunchLeadOrder} from '../../../hooks/useLaunchLeadOrder';
import {NameText, userInfoBarStyles} from './styles';

const LeadingInfoArea = ({nickName, canLead, avatarUrl, leadStatus}) => {
  const {gotoMyProfit} = useGotoProfit();
  const {_t} = useLang();
  const {launchLeadOrder} = useLaunchLeadOrder();
  const {onClickTrackInMainMyLeadPage} = useTracker();
  const gotoTransfer = useGotoTransfer();
  const isUndoing = validateLeaderConfigHelper.isUndoing(leadStatus);

  const gotoMyProfitWithTrack = useMemoizedFn(() => {
    onClickTrackInMainMyLeadPage({
      blockId: 'head',
      locationId: 'myProfile',
    });
    gotoMyProfit();
  });

  const gotoTransferWithTrack = useMemoizedFn(() => {
    onClickTrackInMainMyLeadPage({
      blockId: 'head',
      locationId: 'transfer',
    });
    gotoTransfer();
  });

  const launchLeadOrderWithTrack = useMemoizedFn(() => {
    onClickTrackInMainMyLeadPage({
      blockId: 'head',
      locationId: 'goLead',
    });
    launchLeadOrder();
  });

  const renderName = useCallback(
    name => {
      return (
        <TouchableOpacity
          style={css`
            flex: 1;
            padding-right: 36px;
          `}
          activeOpacity={0.9}
          onPress={gotoMyProfitWithTrack}>
          <RowWrap
            style={css`
              flex: 1;
            `}>
            <NameText numberOfLines={1}>{name}</NameText>
            <LongArrowRightIcon />
          </RowWrap>
        </TouchableOpacity>
      );
    },
    [gotoMyProfitWithTrack],
  );

  return useMemo(
    () => (
      <UserInfoBar
        onPress={gotoMyProfitWithTrack}
        userInfo={{
          avatarUrl,
          nickName,
        }}
        styles={userInfoBarStyles}
        renderName={renderName}>
        {canLead ? (
          <Button
            // 撤销交易员中 禁用
            disabled={isUndoing}
            size="small"
            onPress={launchLeadOrderWithTrack}>
            {_t('e112fe43b1194000a36a')}
          </Button>
        ) : (
          <Button
            // 撤销交易员中 禁用
            disabled={isUndoing}
            size="small"
            type="secondary"
            onPress={gotoTransferWithTrack}>
            {_t('3788a94ec8964000a2e8')}
          </Button>
        )}
      </UserInfoBar>
    ),
    [
      isUndoing,
      gotoMyProfitWithTrack,
      avatarUrl,
      nickName,
      renderName,
      canLead,
      launchLeadOrderWithTrack,
      _t,
      gotoTransferWithTrack,
    ],
  );
};

export default memo(LeadingInfoArea);
