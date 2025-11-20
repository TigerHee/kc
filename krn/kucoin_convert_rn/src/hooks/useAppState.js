/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {useRef, useState, useEffect} from 'react';
import {AppState} from 'react-native';

/**
 * app 运行状态
 * active - 前台运行
 * background - 后台运行
 * @see https://reactnative.cn/docs/appstate
 */
const useAppState = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return appStateVisible;
};

export default useAppState;
