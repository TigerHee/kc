/**
 * Owner: vijay.zhou@kupotech.com
 */
import loadable from '@loadable/component';
import { tenantConfig } from 'config/tenant';
import { useEffect } from 'react';
import { replace } from 'utils/router';

const KybCertification = loadable(() => import('routes/AccountPage/Kyc/Kyb/Certification'));

export default () => {
  useEffect(() => {
    if (!tenantConfig.kyc.upgrade) {
      /** 旧 kyb 认证流程的路由 */
      replace('/account/kyc/institutional-kyc');
    }
  }, []);

  return (
    <main data-inspector="account_kyb_certification_page">
      <KybCertification />
    </main>
  );
};
