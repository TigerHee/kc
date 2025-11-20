import { useSnackbar } from '@kux/mui';
import { useState } from 'react';
import KycCountryOfIssue from 'src/components/Account/Kyc/KycCountryOfIssue';
import { tenantConfig } from 'src/config/tenant';
import { KYC_TYPE } from 'src/constants/kyc/enums';
import useKycCache from 'src/hooks/useKycCache';
import useRegionOptions from 'src/hooks/useRegionOptions';
import { replace } from '@/utils/router';

const CountryOfIssueNotKC = ({ regions }) => {
  const { message } = useSnackbar();
  const [, , postCache] = useKycCache();
  const [loading, setLoading] = useState(false);
  const regionOptions = useRegionOptions(regions);

  const handleSubmit = async (data) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { regionCode, identityType, userState } = data;
      const success = await postCache({
        type: KYC_TYPE.PERSONAL,
        region: regionCode,
        identityType,
        userState,
      });
      if (success) replace('/account/kyc/setup/method');
    } catch (error) {
      console.error(error);
      message.error(error?.msg ?? error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KycCountryOfIssue
      siteType={tenantConfig.siteType}
      countries={regionOptions}
      loading={loading}
      onBack={() => replace('/account/kyc')}
      onSubmit={handleSubmit}
    />
  );
};

export default CountryOfIssueNotKC;
