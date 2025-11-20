import { useSnackbar } from '@kux/mui';
import loadable from '@loadable/component';
import { useEffect, useState } from 'react';
import { tenantConfig } from 'src/config/tenant';
import { pullSiteRegions } from 'src/services/kyc';
import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import KC from './site/KC';
import EU from './site/EU';

/** 其他站目前直出还有问题，先保留异步加载 */
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
  console.warn('check 5: 进入页面了');

  switch (tenantConfig.kyc.siteRegion) {
    case 'global':
      return <KC regions={regions} />;
    case 'europe':
      return <EU regions={regions} />;
    case 'australia':
      return <NotKC regions={regions} />;
    default:
      return null;
  }
};

const CountryOfIssueLayout = () => {
  console.warn('check 4: 进入页面了');
  return (
    <ErrorBoundary scene={SCENE_MAP.kyc.kyc_setup_country_of_issue}>
      <AccountLayout>
        <CountryOfIssue />
      </AccountLayout>
    </ErrorBoundary>
  );
};

export default CountryOfIssueLayout;
