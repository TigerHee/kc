/**
 * Owner: vijay.zhou@kupotech.com
 */
import BaseButton from 'components/Account/Kyc3/Home/KycStatusCard/components/Button';
import { useCallback } from 'react';
import { tenantConfig } from 'src/config/tenant';
import { addLangToPath, _t } from 'tools/i18n';
import { PIFlowTitle, PIFlowWrapper } from '../styled';

export default () => {
  const onPageToTrade = useCallback(() => {
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
