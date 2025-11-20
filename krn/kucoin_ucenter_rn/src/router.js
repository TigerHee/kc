/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-08-03 21:50:29
 * @LastEditors: mike mike@kupotech.com
 * @LastEditTime: 2023-08-09 14:28:01
 * @FilePath: /kucoin_ucenter_rn/src/router.js
 * @Description:
 */
import React, {useEffect, useMemo} from 'react';
import {
  NavigationContainer,
  useNavigationState,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import qs from 'qs';
import KYCPage from 'pages/KYC/home';
import KYCReasonPage from 'pages/KYC/reason';

import KYBPage_TH from 'pages/KYC/kyb_th';
import KYCCitizenshipPage_TH from 'pages/KYC/kyc_citizenship_th';
import KYCMethodPage_TH from 'pages/KYC/kyc_method_th';
import OnboardingPage_TH from 'pages/KYC/onboarding_th';

import {setNavSwipe} from '@krn/bridge';
import {setSource} from 'hooks/useTracker';
import {tracker} from '@krn/toolkit';

import {filterRoutes} from 'site';

const Stack = createNativeStackNavigator();
export const routerMap = [
  {
    name: 'KYCPage',
    component: KYCPage,
    sensorPageId: 'B1KYCHomepage',
    activeBrandKeys: ['global', 'turkey', 'thailand'],
  },
  {
    name: 'KYCReasonPage',
    component: KYCReasonPage,
    sensorPageId: 'B1KYCRejectReason',
    activeBrandKeys: ['global', 'turkey'],
  },
  {
    name: 'KYBPage_TH',
    component: KYBPage_TH,
    sensorPageId: 'B1KYBPageTH',
    activeBrandKeys: ['thailand'],
  },
  {
    name: 'KYCCitizenshipPage_TH',
    component: KYCCitizenshipPage_TH,
    sensorPageId: 'B1KYCCitizenshipPageTH',
    activeBrandKeys: ['thailand'],
  },
  {
    name: 'KYCMethodPage_TH',
    component: KYCMethodPage_TH,
    sensorPageId: 'B1KYCMethodPageTH',
    activeBrandKeys: ['thailand'],
  },
  {
    name: 'KYCOnboardingPage_TH',
    component: OnboardingPage_TH,
    sensorPageId: 'B1KYCOnboardingPageTH',
    activeBrandKeys: ['thailand'],
  },
];

function Router({initRouter}) {
  const initName = useMemo(() => {
    if (initRouter) {
      const [name, query] = decodeURIComponent(initRouter).split('?');
      const selectRoute = routerMap.find(i => i.name === name);
      if (selectRoute) {
        selectRoute.initialParams = qs.parse(query);
        setSource({
          kyc_biz: selectRoute.initialParams?.kyc_biz,
          kyc_from: selectRoute.initialParams?.kyc_from,
        });
        return selectRoute.name;
      }
    }
    return routerMap[0]?.name;
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
              tracker.onPageExpose({
                pageId,
                pre_spm_id: 'kcApp.userCenter.userInfo.1',
              });
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
      {filterRoutes(routerMap).map(item => (
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
