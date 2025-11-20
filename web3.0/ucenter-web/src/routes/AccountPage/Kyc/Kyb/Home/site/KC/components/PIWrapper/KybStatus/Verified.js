/**
 * Owner: vijay.zhou@kupotech.com
 */
import BaseButton from 'components/Account/Kyc3/Home/KycStatusCard/components/Button';
import { useCallback } from 'react';
import { addLangToPath, _t } from 'tools/i18n';
import { PIFlowTitle, PIFlowWrapper } from '../styled';

export default () => {
  const handleDeposit = useCallback(() => {
    window.location.href = addLangToPath(`/assets/coin/${window._BASE_CURRENCY_}`);
  }, []);

  return (
    <>
      <PIFlowWrapper>
        <PIFlowTitle>{_t('ea30c66967424000ad95')}</PIFlowTitle>
        <BaseButton onClick={handleDeposit} variant="outlined">
          {_t('kyc_homepage_deposited_button')}
        </BaseButton>
      </PIFlowWrapper>
    </>
  );
};
