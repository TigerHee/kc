import {useMemoizedFn} from 'ahooks';
import {usePullSummaryQuery} from 'pages/TraderProfile/hooks/usePullSummaryQuery';
import {usePullThirtyDayDataQuery} from 'pages/TraderProfile/hooks/usePullThirtyDayDataQuery';
import {getBaseCurrency} from 'site/tenant';

import {useShare} from 'hooks/copyTrade/useShare';
import {SharePostSceneType} from 'hooks/copyTrade/useShare/constant';
import useTracker from 'hooks/useTracker';
import {convertProfileInfo2SharePayload} from './helper';

export const useShareTraderProfile = () => {
  const {data: thirtyResp, isFetched} = usePullThirtyDayDataQuery();
  const {data: summaryDataResp} = usePullSummaryQuery();
  const {handleShareLeadUserInfo} = useShare({
    sharePostScene: SharePostSceneType.Common,
  });
  const {onClickTrack} = useTracker();
  const {nickName, avatar: avatarUrl} = summaryDataResp?.data || {};

  const onShare = useMemoizedFn(async () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'share',
    });
    handleShareLeadUserInfo(
      convertProfileInfo2SharePayload({
        thirtyDayProfitDetail: thirtyResp?.data,
        userAvatarUrl: avatarUrl,
        userName: nickName,
        tradeSettleCurrency: getBaseCurrency(),
      }),
    );
  });

  return {onShare, isFetched};
};
