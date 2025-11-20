/**
 * Owner: willen@kupotech.com
 * 提交机构kyb
 */
import loadable from '@loadable/component';
import { tenantConfig } from 'config/tenant';
import { useEffect } from 'react';
import { replace } from 'utils/router';

const InstitutionalKyc = loadable(() => import('routes/AccountPage/Kyc/InstitutionalKyc'));

export default () => {
  useEffect(() => {
    if (tenantConfig.kyc.upgrade) {
      /** 新 kyb 认证流程的路由 */
      replace('/account/kyb/certification');
    }
  }, []);

  return <InstitutionalKyc />;
};
