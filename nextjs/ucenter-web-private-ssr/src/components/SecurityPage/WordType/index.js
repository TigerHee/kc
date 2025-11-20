/**
 * Owner: willen@kupotech.com
 */
import { useEffect } from 'react';
import { useRouter } from 'kc-next/router';
import { replace } from 'utils/router';

export default () => {
  const router = useRouter();

  useEffect(() => {
    const query = router?.query;
    // 如果访问的是之前的安全语地址，则重定向到 safeWord 路由
    if (
      query &&
      query.wordType &&
      ['emailSafeword', 'loginSafeword', 'withdrawalSafeWord'].includes(query.wordType)
    ) {
      replace('/account/security/safeWord');
    } else {
      // 否则访问到安全设置页面
      replace('/account/security');
    }
  }, [router?.query]);

  return null;
};
