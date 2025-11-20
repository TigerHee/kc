import {useMemoizedFn} from 'ahooks';

import {RouterNameMap} from 'constants/router-name-map';
import {useGotoFollowSetting} from 'hooks/copyTrade/useGotoFollowSetting';
import {useGotoProfit} from 'hooks/copyTrade/useGotoProfit';
import {usePush} from 'hooks/usePush';
import useTracker from 'hooks/useTracker';

/**
 * 自定义 Hook，用于处理与交易员信息相关的点击事件。
 * @param {Object} params - 参数对象。
 * @param {Object} params.traderInfo - 关于交易员的信息。
 * @param {boolean} params.isCurrent - 表示交易员是否是当前交易员。
 * - `true`: 当前交易员。
 * - `false`: 历史交易员。
 * @returns {void}
 */
export const useClick = ({traderInfo, isHistoryCopyTrader}) => {
  const {copyConfigId, traderInfoResponse} = traderInfo || {};
  const {nickName, leadConfigId, avatarUrl} = traderInfoResponse || {};
  const {onClickTrackInMainMyCopyPage} = useTracker();
  const {push} = usePush();
  const {gotoProfit} = useGotoProfit();
  const {
    gotoCreateFollowSetting: innerGotoCreateFollowSetting,
    gotoViewFollowSetting: innerGotoViewFollowSetting,
  } = useGotoFollowSetting();

  const gotoTraderSummaryPage = useMemoizedFn(() => {
    onClickTrackInMainMyCopyPage({
      blockId: 'myTrader',
      locationId: 'traderPosition',
    });
    push(RouterNameMap.MyTraderPositionSummary, {
      leadConfigId,
      copyConfigId,
      // 与路由qs.parse类型转换字符串 统一
      isHistoryCopyTrader: isHistoryCopyTrader ? 'true' : 'false',
    });
  });

  const gotoViewTraderProfit = useMemoizedFn(hasTack => {
    if (!hasTack) {
      onClickTrackInMainMyCopyPage({
        blockId: 'myTrader',
        locationId: 'traderProfile',
      });
    }
    gotoProfit({nickName, leadConfigId, avatarUrl});
  });

  const gotoViewFollowSetting = useMemoizedFn(() => {
    onClickTrackInMainMyCopyPage({
      blockId: 'myTrader',
      locationId: 'traderSetting',
    });
    innerGotoViewFollowSetting({leadConfigId, copyConfigId});
  });

  const gotoCreateFollowSetting = useMemoizedFn(() => {
    innerGotoCreateFollowSetting(leadConfigId);
  });

  return {
    gotoCreateFollowSetting,
    gotoViewFollowSetting,
    gotoViewTraderProfit,
    gotoTraderSummaryPage,
  };
};
