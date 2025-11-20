import {useMemoizedFn} from 'ahooks';
import {isEqual} from 'lodash';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {TRADER_ACTIVE_STATUS} from 'constants/index';

/** 当头像与用户名发生变更后（审核带单员信息完成） ，需同步 app端 保证 带单员信息 rn与app 保持一致 */
export const useSyncAppLeadInfoUpdate = ({leadSummary}) => {
  const activeLeadSubAccountInfo = useSelector(
    state => state.leadInfo.activeLeadSubAccountInfo,
  );

  const dispatch = useDispatch();

  const syncLeaderDisabledStatus = useCallback(
    status => {
      if (status !== TRADER_ACTIVE_STATUS.Disabled) {
        return;
      }
      dispatch({type: 'leadInfo/resetLeadInfo'});
    },
    [dispatch],
  );

  const pullLeadAvatarAndNameInfoNotifyApp = useCallback(
    summaryData => {
      if (!summaryData || !activeLeadSubAccountInfo) return;
      const {avatar, nickName, status} = summaryData || {};

      const newUpdateAccountInfo = {
        ...activeLeadSubAccountInfo,
        avatar: avatar || activeLeadSubAccountInfo?.avatar,
        nickName: nickName || activeLeadSubAccountInfo?.nickName,
      };

      const isSame = isEqual(newUpdateAccountInfo, activeLeadSubAccountInfo);

      if (!isSame) {
        dispatch({
          type: 'leadInfo/updateLeadInfo',
          payload: {
            activeLeadSubAccountInfo: newUpdateAccountInfo,
          },
        });
      }

      syncLeaderDisabledStatus(status);
    },
    [activeLeadSubAccountInfo, dispatch, syncLeaderDisabledStatus],
  );

  /** 更新带单员子账户是否具备带单初始金额  */
  const updateLeadInfoSufficientInitAmount = useMemoizedFn(
    sufficientInitAmount => {
      dispatch({
        type: 'leadInfo/update',
        payload: {
          sufficientInitAmount: sufficientInitAmount,
        },
      });
    },
  );

  useEffect(() => {
    if (!leadSummary) return;
    pullLeadAvatarAndNameInfoNotifyApp(leadSummary);

    updateLeadInfoSufficientInitAmount(leadSummary?.sufficientInitAmount);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadSummary]);
};
