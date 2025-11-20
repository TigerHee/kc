import {useCallback, useEffect} from 'react';

import {APP2COPY_NAVIGATION_POINTS_2_MAIN_TAB_KEY_MAP} from '../constant';
// ?uiStateValue=copyTradingJump.myCopy
/** MAIN适配APP进入时路由传递 导航定位Tab锚点 标识 */
export const useFitRouteStateValue = ({
  handleActiveTabWithoutLoginCheck,
  initRouteParams,
}) => {
  const {uiStateValue} = initRouteParams || {};
  const handleRouteStateToChangeTab = useCallback(() => {
    if (!uiStateValue) return;
    const fitPointTargetTab =
      APP2COPY_NAVIGATION_POINTS_2_MAIN_TAB_KEY_MAP[uiStateValue];

    if (!fitPointTargetTab) return;
    handleActiveTabWithoutLoginCheck(fitPointTargetTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleActiveTabWithoutLoginCheck, uiStateValue]);

  useEffect(() => {
    handleRouteStateToChangeTab();
  }, [handleRouteStateToChangeTab]);
};
