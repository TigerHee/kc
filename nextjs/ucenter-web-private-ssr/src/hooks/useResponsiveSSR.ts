import { useResponsive } from '@kux/mui';
import { useInitialProps } from 'gbiz-next/InitialProvider';
import { IS_SERVER_ENV } from 'kc-next/env';

const useResponsiveSSR = () => {

  const responsive = useResponsive();
  const initialProps = useInitialProps();

  const value = IS_SERVER_ENV ? {
    // 如果是 app 或者移动端访问，代表屏幕不大于 sm, 所以 sm 是 false
    sm: !['mobile', 'app'].includes(initialProps?._platform),
    md: true, // 不要渲染 md 的，因为其实服务端只能判断是不是 mobile 或者 pc
    // 如果是 app 或者移动端访问，代表屏幕不大于 lg, 所以 lg 也是 false
    // 如果是 pc 访问，则表示屏幕大于 lg, 所以 lg 为 true
    lg: !['mobile', 'app'].includes(initialProps?._platform),
    xl: !['mobile', 'app'].includes(initialProps?._platform),
  } : responsive;

  return value;
};

export default useResponsiveSSR;
