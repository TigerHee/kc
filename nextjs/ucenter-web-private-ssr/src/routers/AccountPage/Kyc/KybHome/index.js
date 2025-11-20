/**
 * Owner: tiger@kupotech.com
 * 旧版 kyb 首页，仅对 TH 站和 TR 站开放
 * global 站和其他共享站用新版
 * 新版看 src/routes/AccountPage/Kyc/Kyb/Home/index.js
 */
import loadable from '@loadable/component';
import { getTenantConfig } from '@/tenant';

const tenantConfig = getTenantConfig();
const TRKybHome = loadable(() => import('./site/TR'));
const THKybHome = loadable(() => import('./site/TH'));

/** @deprecated */
const KYB = ({ triggerType }) => {
  switch (tenantConfig.kyc.KYBHomeComponent) {
    case 'TRKybHome':
      return <TRKybHome triggerType={triggerType} />;
    case 'THKybHome':
      return <THKybHome triggerType={triggerType} />;
    default:
      return null;
  }
};

export default KYB;
