import {useMemoizedFn} from 'ahooks';
import QueryString from 'qs';
import {useContext} from 'react';
import {exitRN, openNative} from '@krn/bridge';
import {NavigationContext} from '@react-navigation/native';

// 是否启用新页面本地调试 仅在开发环境允许拼接 ，生产环境拼接 会出现无法加载 bundle
const enableDebug = __DEV__ && false;
const FOLLOW_BUSINESS_KRN_PREFIX = `/krn/router?biz=follow&entry=main&component=krn_follow_trade${
  enableDebug ? 'isDebug=1' : ''
}`;

export const useNavigation = () => {
  const store = useContext(NavigationContext);
  const openNativeRNPage = useMemoizedFn((routePath, paramObject) => {
    return openNative(
      `${FOLLOW_BUSINESS_KRN_PREFIX}&route=${routePath}?${encodeURIComponent(
        QueryString.stringify(paramObject),
      )}`,
    );
  });

  if (store === undefined) {
    return {
      navigate: openNativeRNPage,
      canGoBack: () => false,
      goBack: exitRN,
      replace: openNativeRNPage,
    };
  }
  return store;
};
