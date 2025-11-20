import React from 'react';
import {Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import {getBaseCurrency} from 'site/tenant';
import styled from '@emotion/native';

import {ShareIcon} from 'components/Common/SvgIcon';
import {largeHitSlop} from 'constants/index';
import {SUPPORT_SHARE_V2_MIN_APP_VERSION} from 'constants/version';
import {useShare} from 'hooks/copyTrade/useShare';
import {SharePostSceneType} from 'hooks/copyTrade/useShare/constant';
import {useIsVersionGreater} from 'hooks/useIsVersionGreater';
import {safeArray} from 'utils/helper';

const StyledPressable = styled(Pressable)`
  margin-left: 2px;
`;

export const LeadPnlShare = ({timeCycleStatisticList, totalPnl}) => {
  const {handleShareLeadTraderTotalPnl} = useShare({
    sharePostScene: SharePostSceneType.MyLead,
  });
  const leadInfo =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};
  const {nickName, avatar} = leadInfo;

  const checkVersionGreater = useIsVersionGreater();

  const pnlList =
    safeArray(timeCycleStatisticList).map(item => {
      const pnl = item.pnl;
      return isNaN(pnl) ? 0 : pnl;
    }) || [];

  const onShare = () => {
    handleShareLeadTraderTotalPnl({
      userName: nickName,
      userAvatarUrl: avatar,
      leadTotalPnlData: pnlList,
      leadTotalPnlValue: totalPnl,
      tradeSettleCurrency: getBaseCurrency() /** 结算单位,默认USDT */,
    });
  };

  if (!checkVersionGreater(SUPPORT_SHARE_V2_MIN_APP_VERSION)) {
    return null;
  }

  return (
    <StyledPressable
      hitSlop={largeHitSlop}
      activeOpacity={0.8}
      onPress={onShare}>
      <ShareIcon />
    </StyledPressable>
  );
};
