/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import systemDynamic from 'src/utils/systemDynamic';
import HOST from 'utils/siteConfig';

const ModalForbid = systemDynamic('@kucoin-biz/entrance', 'ModalForbid');

const Index = (props) => {
  const { onCancel = () => {} } = props || {};
  const { currentLang } = useLocale();

  return <ModalForbid onCancel={onCancel} currentLang={currentLang} HOST={HOST} />;
};

export default Index;
