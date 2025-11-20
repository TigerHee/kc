/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useEffect, useMemo} from 'react';
import {
  NavigationContainer,
  // useNavigationState,
} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GemboxPage from 'pages/Gembox';
import qs from 'qs';
import {setNavSwipe} from '@krn/bridge';

// const Stack = createNativeStackNavigator();

const routerMap = [
  {
    name: 'GemboxPage',
    component: GemboxPage,
    options: {headerShown: false},
  },
];

function Router({initRouter}) {
  const initName = useMemo(() => {
    if (initRouter) {
      // todo 是否加decodeURIComponent？
      // const [name, query] = decodeURIComponent(initRouter).split('?');
      const [name, query] = initRouter.split('?');
      const selectRoute = routerMap.find(i => i.name === name);
      if (selectRoute) {
        selectRoute.initialParams = qs.parse(query);
        return selectRoute.name;
      }
    }
    return 'GemboxPage';
  }, [initRouter]);

  // // tips：多路由解除以下注释，解决ios右滑问题。具体参考下面的链接
  // const routeList = useNavigationState(i => i?.routes) || [{name: initName}];

  // useEffect(() => {
  //   // 解决ios右滑问题
  //   // https://www.codeleading.com/article/70221126828/
  //   setNavSwipe(routeList.length === 1);
  // }, [routeList]);

  // ios默认禁用右滑返回，需要手动开启
  useEffect(() => {
    setNavSwipe(true);
  }, []);

  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName={initName}>
    //     {routerMap.map(item => (
    //       <Stack.Screen key={item.name} {...item} />
    //     ))}
    //   </Stack.Navigator>
    // </NavigationContainer>
    <GemboxPage />
  );
}

export default Router;
