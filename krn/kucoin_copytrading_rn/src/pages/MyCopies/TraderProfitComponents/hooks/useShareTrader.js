import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {getBaseCurrency} from 'site/tenant';

import {SUPPORT_SHARE_V2_MIN_APP_VERSION} from 'constants/version';
import {useShare} from 'hooks/copyTrade/useShare';
import {SharePostSceneType} from 'hooks/copyTrade/useShare/constant';
import {useIsVersionGreater} from 'hooks/useIsVersionGreater';
import useTracker from 'hooks/useTracker';
import {getUserShowFullName} from 'utils/user';

export const useShareTrader = ({info}) => {
  const {handleShareCopyTraderFollowOneTraderPnl, handleShareLeadUserInfo} =
    useShare({
      sharePostScene: SharePostSceneType.MyCopy,
    });

  const {onClickTrackInMainMyCopyPage} = useTracker();
  const userInfo = useSelector(state => state.app.userInfo);
  const checkVersionGreater = useIsVersionGreater();

  const onShare = useCallback(() => {
    onClickTrackInMainMyCopyPage({
      blockId: 'myTrader',
      locationId: 'traderShare',
    });
    const {traderInfoResponse, thirtyDayProfitDetail, totalPnlRatio, totalPnl} =
      info || {};

    const {
      totalPnlDate = {},
      thirtyDayPnlRatio,
      thirtyDayPnl,
    } = thirtyDayProfitDetail || {};

    if (!checkVersionGreater(SUPPORT_SHARE_V2_MIN_APP_VERSION)) {
      handleShareLeadUserInfo({
        userAvatarUrl: traderInfoResponse?.avatarUrl,
        userName: traderInfoResponse?.nickName,
        lead30DayPnl: thirtyDayPnlRatio,
        // 兼容新版本不做格式化
        lead30DayValue: thirtyDayPnl,
        lead30DayData: totalPnlDate?.map(i => `${i}`) || [],
        tradeSettleCurrency: getBaseCurrency(),
      });
      return;
    }

    handleShareCopyTraderFollowOneTraderPnl({
      copyTraderName: getUserShowFullName(userInfo) /** 跟单用户名称 */,
      copyTraderAvatarUrl:
        userInfo?.avatar /** 跟单者用户头像地址，分享记得需要下载完成之后再渲染 */,
      // 历史交易员info 没有totalPnlRatio 需要透传空字符串 端上分享海报做判空字符串 兼容展示
      pnlPercent: totalPnlRatio || '' /** 盈亏百分比 */,
      pnlValue: totalPnl /** 盈亏数额 */,
      leadTraderName: traderInfoResponse?.nickName /** 带单者的名字 */,
    });
  }, [
    checkVersionGreater,
    handleShareCopyTraderFollowOneTraderPnl,
    handleShareLeadUserInfo,
    info,
    onClickTrackInMainMyCopyPage,
    userInfo,
  ]);

  return {
    onShare,
  };
};
