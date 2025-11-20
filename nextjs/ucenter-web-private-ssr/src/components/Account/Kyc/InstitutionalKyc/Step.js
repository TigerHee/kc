/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { Steps } from '@kux/mui';
import { _t } from 'tools/i18n';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const { Step } = Steps;

export default function CustomStep({ activeStep }) {
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;
  useLocale();
  return (
    <Steps
      size="small"
      current={activeStep}
      labelPlacement={isH5 ? 'horizontal' : 'vertical'}
      direction={isH5 ? 'vertical' : 'horizontal'}
    >
      <Step description={_t('kyc.company.information')} />
      <Step description={_t('kyc.contact.information')} />
      <Step description={_t('kyc.verification.info.documents.title')} />
      <Step description={_t('kyc.verification.info.result.title')} />
    </Steps>
  );
}
