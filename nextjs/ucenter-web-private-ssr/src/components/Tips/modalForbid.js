/**
 * Owner: willen@kupotech.com
 */
import { safeDynamic } from '@/tools/safeDynamic';
import { getSiteConfig } from 'kc-next/boot';
import { getCurrentLang } from 'kc-next/i18n';

const ModalForbid = safeDynamic(() => import('gbiz-next/entrance').then(mod => mod.ModalForbid), {
  ssr: false,
});

const Index = (props) => {
  const { onCancel = () => {} } = props || {};
  const currentLang = getCurrentLang();
  const HOST = getSiteConfig();

  return <ModalForbid onCancel={onCancel} currentLang={currentLang} HOST={HOST} />;
};

export default Index;
