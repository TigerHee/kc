import {useSelector} from 'react-redux';

import {useIsLogin} from 'hooks/useWithLoginFn';
import {useIsMySelf} from './useIsMySelf';

export const useIsShowFollowOrderFooter = () => {
  const isLeadTrader = useSelector(state => state.leadInfo.isLeadTrader);
  const isLogin = useIsLogin();

  const isUnLogin = isLogin === false;

  const isLeadInfoPullingScene =
    isLeadTrader === null || isLeadTrader === undefined;
  const isMySelf = useIsMySelf();

  // 未登录展示跟单底部组件（承接未登录与已登录非本人业务态） && 带单人信息未拉取时
  return isUnLogin || (!isMySelf && !isLeadInfoPullingScene);
};
