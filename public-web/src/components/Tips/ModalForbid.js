/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ModalForbid } from '@kucoin-biz/entrance';
import HOST from 'utils/siteConfig';

const Index = (props) => {
  const { onCancel = () => {} } = props || {};
  const { currentLang } = useLocale();

  return <ModalForbid onCancel={onCancel} currentLang={currentLang} HOST={HOST} />;
};

export default Index;
