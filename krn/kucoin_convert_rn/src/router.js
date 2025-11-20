/**
 * Owner: willen@kupotech.com
 */
import React, {useEffect, useMemo} from 'react';
import {
  NavigationContainer,
  useNavigationState,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import qs from 'qs';
import ConvertPage from 'pages/Convert';
import ConvertHistoryPage from 'pages/Convert/history';
import ConvertCoinListPage from 'pages/Convert/coinList';
import ConvertHistoryDetailPage from 'pages/Convert/detail';
import ConvertResultPage from 'pages/Convert/result';
import ConvertFAQPage from 'pages/Convert/faq';
import ErrorPage from 'pages/error';
import {setNavSwipe} from '@krn/bridge';
import {tracker} from '@krn/toolkit';

import * as site from './site';

const Stack = createNativeStackNavigator();
const activeBrandKeys = ['global', 'turkey', 'thailand'];

export const routerMap = [
  {
    name: 'ConvertPage',
    component: ConvertPage,
    sensorPageId: 'BSfastTradeNew',
    activeBrandKeys,
  },
  {
    name: 'ConvertHistoryPage',
    component: ConvertHistoryPage,
    sensorPageId: 'BSfastTradeHistoryNew',
    activeBrandKeys,
  },
  {
    name: 'ConvertCoinListPage',
    component: ConvertCoinListPage,
    sensorPageId: 'BSfastTradeCoinChooseNew',
    activeBrandKeys,
  },
  {
    name: 'ConvertHistoryDetailPage',
    component: ConvertHistoryDetailPage,
    sensorPageId: 'BSfastTradeHistoryDetailNew',
    activeBrandKeys,
  },
  {
    name: 'ConvertResultPage',
    component: ConvertResultPage,
    sensorPageId: 'BSfastTradeResultNew',
    activeBrandKeys,
  },
  {
    name: 'ConvertFAQPage',
    component: ConvertFAQPage,
    sensorPageId: 'BSfastTradeFAQNew',
    activeBrandKeys,
  },
  {
    name: 'ErrorPage',
    component: ErrorPage,
    sensorPageId: 'BSfastTradeErrorNew',
    activeBrandKeys,
  },
];

function Router({initRouter}) {
  const initName = useMemo(() => {
    if (initRouter) {
      const [name, query] = decodeURIComponent(initRouter).split('?');
      const selectRoute = routerMap.find(i => i.name === name);
      if (selectRoute) {
        selectRoute.initialParams = qs.parse(query);
        return selectRoute.name;
      }
    }
    return 'ConvertPage';
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
            const pageId = routerMap.find(
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
      {site.filterRoutes(routerMap).map(item => (
        <Stack.Screen key={item.name} {...item} />
      ))}
    </Stack.Navigator>
  );
}

export default ({initRouter}) => {
  return (
    <NavigationContainer>
      <Router initRouter={initRouter} />
    </NavigationContainer>
  );
};
