import { useEffect, useState } from 'react';
import KybCountry from 'src/components/Account/Kyc/KybCountry';
import { KYC_TYPE } from 'src/constants/kyc/enums';
import useKybCountries from 'src/hooks/useKybCountries';
import useKycCache from 'src/hooks/useKycCache';
import useRegionOptions from 'src/hooks/useRegionOptions';
import { _t } from 'src/tools/i18n';
import { push, replace } from '@/utils/router';

export default () => {
  const [countries, pullCountries] = useKybCountries();
  const [, pullCache, postCache] = useKycCache();
  const countryOptions = useRegionOptions(countries);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ regionCode }) => {
    try {
      const success = await postCache({
        type: KYC_TYPE.INSTITUTIONAL,
        region: regionCode,
      });
      if (success) push('/account/kyb/home');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    pullCountries();
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { region, type } = await pullCache();
        if (region && type === KYC_TYPE.PERSONAL) {
          replace('/account/kyb/home');
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <main>
      <KybCountry
        countries={countryOptions}
        loading={loading}
        backText={_t('b561bd4fa3e24000a21f')}
        onSubmit={handleSubmit}
        onBack={() => push('/account/kyc')}
      />
    </main>
  );
};
