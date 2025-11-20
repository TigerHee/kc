/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { Alert } from '@kux/mui';
import { _t } from 'tools/i18n';

const Notice = (props) => {
  useLocale();
  return (
    <div {...props}>
      <Alert type="warning" description={_t('kyc.mechanism.verify.info.notice')} showIcon={false} />
    </div>
  );
};

export default Notice;
