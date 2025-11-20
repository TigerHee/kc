import {useDebounceFn} from 'ahooks';

import {MeasureTTIHelper} from 'utils/performance';
// import {useNavigation, useRoute} from '@react-navigation/native';
import {useNavigation} from './hybridNavigation';

/**
 * 跳转到指定的路由路径，并且可以携带参数。
 * 如果 forceOpenByNative 参数为 true，则强制使用原生方式打开。
 *
 * @param {string} routePath - 需要跳转到的路由路径。
 * @param {Object} paramObject - 需要传递的参数对象 注意对象会被qs stringify 丢失类型，参数 value 类型规范为字符串类型
 * @param {boolean} [forceOpenByNative=false] - 是否强制使用原生方式打开。
 */
export const usePush = () => {
  const navigation = useNavigation();

  const {run: pushPage} = useDebounceFn(
    (routePath, paramObject) => {
      MeasureTTIHelper.markNavigationRouterStart();

      navigation.navigate(routePath, paramObject);
    },
    {
      leading: true,
      trailing: false,
      wait: 500,
    },
  );

  const {run: replace} = useDebounceFn(
    (routePath, paramObject) => {
      MeasureTTIHelper.markNavigationRouterStart();

      navigation.replace(routePath, paramObject);
    },
    {
      leading: true,
      trailing: false,
      wait: 500,
    },
  );

  return {
    /**
     * 跳转到指定的路由路径，并且可以携带参数。
     * 如果 forceOpenByNative 参数为 true，则强制使用原生方式打开。
     *
     * @param {string} routePath - 需要跳转到的路由路径。
     * @param {Object} paramObject - 需要传递的参数对象 注意对象会被qs stringify 丢失类型，参数 value 类型规范为字符串类型
     * @param {boolean} [forceOpenByNative=false] - 是否强制使用原生方式打开。
     */
    push: pushPage,
    replace,
  };
};
