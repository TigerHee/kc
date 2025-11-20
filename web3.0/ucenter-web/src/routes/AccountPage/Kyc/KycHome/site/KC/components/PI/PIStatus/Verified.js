/**
 * Owner: tiger@kupotech.com
 */
import BaseButton from 'components/Account/Kyc3/Home/KycStatusCard/components/Button';
import { searchToJson } from 'helper';
import { useCallback } from 'react';
import { addLangToPath } from 'tools/i18n';
// import { trackClick } from 'utils/ga';
import { tenantConfig } from 'src/config/tenant';
import { _t } from 'tools/i18n';
import { PIFlowTitle, PIFlowWrapper } from '../style';

const { soure } = searchToJson();

export default ({ sensorStatus }) => {
  const onPageToTrade = useCallback(() => {
    // trackClick(['Deposit', '1'], {
    //   soure: soure || '',
    //   kyc_homepage_status: sensorStatus,
    // });
    window.location.href = addLangToPath(tenantConfig.account.featureTradeUrl);
  }, []);

  return (
    <>
      <PIFlowWrapper>
        <PIFlowTitle>{_t('3ff88d144e9c4000ae2c')}</PIFlowTitle>
        <BaseButton onClick={onPageToTrade} variant="outlined">
          {_t('b25a376c082f4000a1ab')}
        </BaseButton>
      </PIFlowWrapper>
    </>
  );
};
