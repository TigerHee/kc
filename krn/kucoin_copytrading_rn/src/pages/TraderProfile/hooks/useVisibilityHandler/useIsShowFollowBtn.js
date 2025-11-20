import {useMemo} from 'react';
import {useSelector} from 'react-redux';

import {TRADER_ACTIVE_STATUS} from 'constants/businessType';
import {useParams} from 'hooks/useParams';
import {useIsLogin} from 'hooks/useWithLoginFn';

export const useIsShowFollowBtn = ({status}) => {
  const {leadConfigId} = useParams();

  const isLogin = useIsLogin();
  // 未登录标识
  const isUnLoginScene = isLogin === false;
  const isLeadTrader = useSelector(state => state.leadInfo.isLeadTrader);
  const {configId: myLeadConfigId} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};
  // 当前交易员详情是否为本人交易员
  const isMySelf = useMemo(
    () => String(myLeadConfigId) === String(leadConfigId),
    [leadConfigId, myLeadConfigId],
  );

  //   myLeadConfigId存在且 summaryData接口返回数据不为禁用时展示
  const showFollowBtn =
    isLeadTrader !== null &&
    !!status &&
    status !== TRADER_ACTIVE_STATUS.Disabled &&
    !isMySelf;

  // 已登录场景 判断是否展示关注区域按钮 || 未登录场景直接展示
  return showFollowBtn || isUnLoginScene;
};
