/**
 * Owner: willen@kupotech.com
 */
import { withRouter } from 'components/Router';
import { useEffect } from 'react';
import { replace } from 'utils/router';

export default withRouter((props) => {
  const { query = {} } = props;

  useEffect(() => {
    // 如果访问的是之前的安全语地址，则重定向到 safeWord 路由
    if (
      query.wordType &&
      ['emailSafeword', 'loginSafeword', 'withdrawalSafeWord'].includes(query.wordType)
    ) {
      replace('/account/security/safeWord');
    } else {
      // 否则访问到 /404
      replace('/404');
    }
  }, [query.wordType]);

  return null;
});
