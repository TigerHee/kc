import {useMemoizedFn} from 'ahooks';
import {useCallback} from 'react';
import {useSelector} from 'react-redux';

import {QueryKeys} from 'constants/queryKeys';
import {RouterNameMap} from 'constants/router-name-map';
import {usePush} from 'hooks/usePush';
import {QueryPreloadController} from 'utils/query-client-cache-controller';

export const useGotoProfit = () => {
  const {push} = usePush();
  const {
    configId: myLeadConfigId,
    avatar: myLeadAvatar,
    nickName: myLeadNickName,
  } = useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};
  /**  leadConfigId 必传，其他对齐QueryKeys.queryTraderDetailShowInfoSummary 预加载 */
  const gotoProfit = useCallback(
    async info => {
      const {nickName, leadConfigId, avatarUrl, daysAsLeader} = info || {};

      if (!leadConfigId) {
        console.error('leadConfigId is required');
      }

      await QueryPreloadController.preWriteQueryData(
        [QueryKeys.queryTraderDetailShowInfoSummary, `${leadConfigId}`],
        {
          data: {
            nickName,
            avatar: avatarUrl,
            leadDays: daysAsLeader,
          },
        },
      );

      push(RouterNameMap.TraderProfile, {
        leadConfigId: leadConfigId,
      });
    },
    [push],
  );

  const gotoMyProfit = useMemoizedFn(() => {
    push(RouterNameMap.TraderProfile, {
      leadConfigId: myLeadConfigId,
      avatar: myLeadAvatar,
      nickName: myLeadNickName,
    });
  });

  return {gotoProfit, gotoMyProfit};
};
