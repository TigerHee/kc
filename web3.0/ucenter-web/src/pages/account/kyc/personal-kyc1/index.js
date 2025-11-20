/**
 * Owner: Lena@kupotech.com
 */
import { useEffect } from 'react';
import { replace } from 'utils/router';

export default () => {
  // 兜底有项目使用了/account/kyc/personal-kyc1路由
  useEffect(() => {
    replace('/account/kyc');
  }, []);
  return <></>;
};
