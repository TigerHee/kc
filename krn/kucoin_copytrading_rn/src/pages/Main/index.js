import React, {memo, useEffect} from 'react';

import {eventBus, GlobalEventBusType} from 'utils/event-bus';
import {isAndroid} from 'utils/helper';
import {useMeasureElementTTI} from 'utils/performance';
import {useEmitAppNavigationEventAndRouteFlag} from './hooks/useEmitAppNavigationEventAndRouteFlag';
import {useFetchSafeguard} from './hooks/useFetchSafeguard';
import {useFitRouteStateValue} from './hooks/useFitRouteStateValue';
import {useMainExpose} from './hooks/useMainExpose';
import {useMainTabHandler} from './hooks/useMainTabHandler';
import {useMakeMainTabList} from './hooks/useMakeMainTabList';
import {ScrollableMain} from './ScrollableTabMain';
import {TabMain} from './TabMain';

const MainTabContent = isAndroid ? TabMain : ScrollableMain;

const Main = ({initRouteParams}) => {
  const {handlePageRootLayout} = useMeasureElementTTI();

  const mainTabList = useMakeMainTabList();
  const {handleActiveTab, activeTabKey, handleActiveTabWithoutLoginCheck} =
    useMainTabHandler(mainTabList);
  useMainExpose({activeTabKey});

  useEmitAppNavigationEventAndRouteFlag({handleActiveTab});
  useFitRouteStateValue({handleActiveTabWithoutLoginCheck, initRouteParams});
  useFetchSafeguard();
  useEffect(() => {
    eventBus.on(GlobalEventBusType.SwitchMainTab, handleActiveTab);
    return () => {
      eventBus.off(GlobalEventBusType.SwitchMainTab);
    };
  }, [handleActiveTab]);

  return (
    <MainTabContent
      onLayout={handlePageRootLayout}
      mainTabList={mainTabList}
      handleActiveTab={handleActiveTab}
      activeTabKey={activeTabKey}
    />
  );
};

export default memo(Main);
