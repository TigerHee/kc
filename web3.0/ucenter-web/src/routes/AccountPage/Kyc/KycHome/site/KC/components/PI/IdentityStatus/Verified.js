/**
 * Owner: tiger@kupotech.com
 */
import BaseButton from 'components/Account/Kyc3/Home/KycStatusCard/components/Button';
import { searchToJson } from 'helper';
import { useCallback } from 'react';
import { addLangToPath, _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { PIFlowTitle, PIFlowWrapper } from '../style';

const { soure } = searchToJson();

export default ({ sensorStatus }) => {
  const handleDeposit = useCallback(() => {
    trackClick(['Deposit', '1'], {
      soure: soure || '',
      kyc_homepage_status: sensorStatus,
    });
    window.location.href = addLangToPath(`/assets/coin/${window._BASE_CURRENCY_}`);
  }, [sensorStatus]);

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
