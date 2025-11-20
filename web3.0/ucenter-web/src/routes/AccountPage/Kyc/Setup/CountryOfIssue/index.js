import { useSnackbar } from '@kux/mui';
import loadable from '@loadable/component';
import { useEffect, useState } from 'react';
import { tenantConfig } from 'src/config/tenant';
import { pullSiteRegions } from 'src/services/kyc';

const KC = loadable(() => import('./site/KC'));
const NotKC = loadable(() => import('./site/NotKC'));

const CountryOfIssue = () => {
  const { message } = useSnackbar();
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    pullSiteRegions({ siteType: tenantConfig.kyc.siteRegion, kycType: 1 })
      .then(({ data }) => {
        setRegions(data ?? []);
      })
      .catch((error) => {
        console.error(error);
        message.error(error?.msg ?? error?.message);
      });
  }, []);

  switch (tenantConfig.kyc.siteRegion) {
    case 'global':
      return <KC regions={regions} />;
    case 'australia':
    case 'europe':
      return <NotKC regions={regions} />;
    default:
      return null;
  }
};

export default CountryOfIssue;
