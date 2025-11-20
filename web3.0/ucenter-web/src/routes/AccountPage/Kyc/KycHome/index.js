/**
 * Owner: vijay.zhou@kupotech.com
 * 根据站点渲染对应的组件
 */
import loadable from '@loadable/component';
import { tenantConfig } from 'config/tenant';

const KCKycHome = loadable(() => import('./site/KC'));
const TRKycHome = loadable(() => import('./site/TR'));
const THKycHome = loadable(() => import('./site/TH'));

export default function KycHome(props) {
  switch (tenantConfig.kyc.KYCHomeComponent) {
    case 'THKycHome':
      return <THKycHome {...props} />;
    case 'TRKycHome':
      return <TRKycHome {...props} />;
    case 'KCKycHome':
      return <KCKycHome {...props} />;
    default:
      return null;
  }
}
