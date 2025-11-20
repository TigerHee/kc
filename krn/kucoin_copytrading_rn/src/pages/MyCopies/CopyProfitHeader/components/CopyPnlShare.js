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
import {useMutation} from 'hooks/react-query';
import {useIsVersionGreater} from 'hooks/useIsVersionGreater';
import {queryCurrentMyCopyTraderList} from 'services/copy-trade';
import {safeArray} from 'utils/helper';
import {getUserShowFullName} from 'utils/user';

const StyledPressable = styled(Pressable)`
  margin-left: 2px;
`;
export const CopyPnlShare = ({totalPnlDateList, totalPnl}) => {
  const {handleShareCopyTraderTotalPnl} = useShare({
    sharePostScene: SharePostSceneType.MyCopy,
  });
  const userInfo = useSelector(state => state.app.userInfo) || {};

  const checkVersionGreater = useIsVersionGreater();

  const pnlList = safeArray(totalPnlDateList).map(item => item.totalPnl) || [];

  const {mutateAsync} = useMutation({
    mutationFn: async () =>
      await queryCurrentMyCopyTraderList({
        currentPage: 1,
        pageSize: 3,
        sortType: 1, //1:按照跟跟随带单人收益额从大到小排序
      }),
  });

  const onShare = async () => {
    const {data: leadTraderList} = (await mutateAsync()) || {};

    const {avatar} = userInfo;
    handleShareCopyTraderTotalPnl({
      leadTradersNameData: leadTraderList
        ?.slice(0, 3)
        .map(i => i?.traderInfoResponse?.nickName),
      userName: getUserShowFullName(userInfo),
      userAvatarUrl: avatar,
      totalPnlData: pnlList,
      totalPnlValue: totalPnl,
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
