import React, {memo, useEffect, useMemo} from 'react';
import getTenantConfig from 'site/tenant';
import {setNavSwipe} from '@krn/bridge';
import {tenant, tracker} from '@krn/toolkit';
import {
  NavigationContainer,
  useNavigationState,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {getInitialParams} from 'utils/init-router-helper';
import {routerList} from './copy-trade';

const Stack = createNativeStackNavigator();

function Router({initRouter}) {
  const renderRouterList = useMemo(() => {
    const list = tenant.filterRoutes(routerList, getTenantConfig());

    if (!initRouter) {
      return list;
    }
    const {name, params} = getInitialParams(initRouter);

    return list.map(i => {
      if (i.name !== name) return i;
      return {
        ...i,
        initialParams: params,
      };
    });
  }, [initRouter]);

  const initName = useMemo(() => {
    if (initRouter) {
      const [name] = decodeURIComponent(initRouter).split('?');
      const selectRoute = routerList.find(i => i.name === name);
      if (selectRoute) {
        return selectRoute.name;
      }
    }
    return routerList[0]?.name;
  }, [initRouter]);

  const routeList = useNavigationState(i => i?.routes) || [{name: initName}];

  useEffect(() => {
    // 解决ios右滑问题
    // https://www.codeleading.com/article/70221126828/
    setNavSwipe(routeList.length === 1);
  }, [routeList]);

  return (
    <Stack.Navigator
      screenListeners={{
        state: e => {
          // 路由发生变化，进行神策页面访问埋点
          const routeState = e?.data?.state;
          const currentRouteName = routeState?.routes[routeState?.index]?.name;
          if (currentRouteName) {
            const pageId = routerList.find(
              i => i.name === currentRouteName,
            )?.sensorPageId;
            if (pageId) {
              const {prePageId, preLoadTime} = tracker.getConfigInfo();
              if (prePageId) {
                // 前一个页面的停留时长
                tracker.onPageView({
                  pageId: prePageId,
                  eventDuration: Date.now() - preLoadTime,
                });
              }
              // 当前页面曝光埋点
              tracker.onPageExpose({pageId});

              tracker.setConfigInfo({
                prePageId: pageId,
                preLoadTime: Date.now(),
              });
            }
          }
        },
      }}
      initialRouteName={initName}
      screenOptions={{headerShown: false}}>
      {renderRouterList.map(item => (
        <Stack.Screen key={item.name} {...item} />
      ))}
    </Stack.Navigator>
  );
}

export default memo(({initRouter}) => {
  return (
    <NavigationContainer>
      <Router initRouter={initRouter} />
    </NavigationContainer>
  );
});
