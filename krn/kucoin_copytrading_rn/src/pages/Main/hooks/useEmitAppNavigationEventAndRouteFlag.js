import {useEffect, useRef} from 'react';
import {KRNEventEmitter} from '@krn/bridge';

import {
  APP2COPY_NAVIGATION_POINTS,
  APP2COPY_NAVIGATION_POINTS_2_MAIN_TAB_KEY_MAP,
} from '../constant';

const NavigationEventConfigList = [
  APP2COPY_NAVIGATION_POINTS.copyHome,
  APP2COPY_NAVIGATION_POINTS.myCopy,
  APP2COPY_NAVIGATION_POINTS.myLeading,
];

/** 首页 订阅APP发布的 导航定位Tab锚点 消息 */
export const useEmitAppNavigationEventAndRouteFlag = ({handleActiveTab}) => {
  const navigationEventRef = useRef();

  useEffect(() => {
    navigationEventRef.current = NavigationEventConfigList.map(eventKey => {
      return KRNEventEmitter.addListener(eventKey, () => {
        const targetTabValue =
          APP2COPY_NAVIGATION_POINTS_2_MAIN_TAB_KEY_MAP[eventKey];

        handleActiveTab(targetTabValue);
      });
    });

    return () => {
      navigationEventRef.current?.forEach?.(listener => {
        listener?.remove();
      });
    };
  }, [handleActiveTab]);
};
