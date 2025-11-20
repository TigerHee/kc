/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-12-27 22:06:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-04 21:12:51
 * @FilePath: /public-web/src/components/Root/strategies.js
 * @Description:
 */
/**
 * Owner: solar@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocation } from 'react-router-dom';

// 不展示header的黑名单策略
const blackHeaderStrategies = [
  (path, isInApp) => {
    if (path.startsWith('/pre-market') && isInApp) {
      return true;
    }
    if (path.startsWith('/gemvote') && isInApp) {
      return true;
    }
    if (path.startsWith('/gemslot') && isInApp) {
      return true;
    }
    if (path.startsWith('/gemspace') && isInApp) {
      return true;
    }
    if (path.startsWith('/gempool') && isInApp) {
      return true;
    }
    if (path.startsWith('/spotlight-center') && isInApp) {
      return true;
    }
    if (path.startsWith('/spotlight_r6') && isInApp) {
      return true;
    }
    if (path.startsWith('/kcs') && isInApp) {
      return true;
    }
    if (path.startsWith('/user-guide') && isInApp) {
      return true;
    }
  },
];

// 不展示footer的黑名单策略
const blackFooterStrategies = [
  (path, isInApp) => {
    if (path.startsWith('/pre-market') && isInApp) {
      return true;
    }
    if (path.startsWith('/gemvote') && isInApp) {
      return true;
    }
    if (path.startsWith('/gemslot') && isInApp) {
      return true;
    }
    if (path.startsWith('/gemspace') && isInApp) {
      return true;
    }
    if (path.startsWith('/gempool') && isInApp) {
      return true;
    }
    if (path.startsWith('/spotlight-center') && isInApp) {
      return true;
    }
    if (path.startsWith('/spotlight_r6') && isInApp) {
      return true;
    }
    if (path.startsWith('/spotlight7') && isInApp) {
      return true;
    }
    if (path.startsWith('/spotlight_r8') && isInApp) {
      return true;
    }
    if (path.startsWith('/user-guide') && isInApp) {
      return true;
    }
  },
];

export function useHeaderInBlackList() {
  const { pathname } = useLocation();
  const isInApp = JsBridge.isApp();
  return !blackHeaderStrategies.some((fn) => fn(pathname, isInApp));
}

export function useFooterInBlackList() {
  const { pathname } = useLocation();
  const isInApp = JsBridge.isApp();
  return !blackFooterStrategies.some((fn) => fn(pathname, isInApp));
}

export function withBlackList(WrappedComponent) {
  return function (props) {
    const { pathname } = props;
    const isInApp = JsBridge.isApp();
    const headerInBlackList = blackHeaderStrategies.some((fn) => fn(pathname, isInApp));
    const footerInBlackList = blackFooterStrategies.some((fn) => fn(pathname, isInApp));
    const newProps = { ...props, headerInBlackList, footerInBlackList };
    return <WrappedComponent {...newProps} />;
  };
}
