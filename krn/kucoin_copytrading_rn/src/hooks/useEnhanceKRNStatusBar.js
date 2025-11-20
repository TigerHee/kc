import {useMemoizedFn} from 'ahooks';
import {useLayoutEffect, useState} from 'react';

import {eventBus, GlobalEventBusType} from 'utils/event-bus';
export const useEnhanceKRNStatusBar = (isDarkMode, options = {}) => {
  const [statusBarOptions, setStatusBarOptions] = useState({
    translucent: false,
    barStyle: isDarkMode ? 'light-content' : 'dark-content',
    ...options,
  });

  const handleUpdateStatusBarStyle = useMemoizedFn(options => {
    setStatusBarOptions({
      ...options,
    });
  });

  const getStatusBarStyle = useMemoizedFn(() => statusBarOptions);

  useLayoutEffect(() => {
    eventBus.once(GlobalEventBusType.GetStatusBarStyle, getStatusBarStyle);

    eventBus.once(
      GlobalEventBusType.UpdateStatusBarStyle,
      handleUpdateStatusBarStyle,
    );

    return () => {
      eventBus.off(GlobalEventBusType.GetStatusBarStyle);
      eventBus.off(GlobalEventBusType.UpdateStatusBarStyle);
    };
  }, [handleUpdateStatusBarStyle, getStatusBarStyle]);

  return statusBarOptions;
};
