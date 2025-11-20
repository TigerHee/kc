import JsBridge from 'gbiz-next/bridge';
import { getTenantConfig } from '@/tenant';

export default function toContactSupport() {
  const isInApp = JsBridge.isApp();
  const tenantConfig = getTenantConfig();
  if (isInApp) {
    const encodeUrl = encodeURIComponent(tenantConfig.resetSecurity.supportUrl);
    JsBridge.open({ type: 'jump', params: { url: `/link?url=${encodeUrl}` } });
  } else {
    window.open(tenantConfig.resetSecurity.supportUrl, '_blank');
  }
}
