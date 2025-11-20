/**
 * Owner: vijay.zhou@kupotech.com
 * 根据站点渲染对应的组件
 */
import loadable from '@loadable/component';
import { tenantConfig } from 'config/tenant';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useKycSiteModel from 'src/hooks/useKycSiteModel';
import { push } from 'utils/router';

const KCKycHome = loadable(() => import('./site/KC'));
const AUKycHome = loadable(() => import('./site/AU'));
const EUKycHome = loadable(() => import('./site/EU'));

export default function KycHome() {
  const dispatch = useDispatch();
  const kycInfo = useSelector((state) => state.kyc?.kycInfo);
  const { loading: modelLoading } = useKycSiteModel();

  const loading = modelLoading || isEmpty(kycInfo);
  const handleBack = () => push('/account/kyc/setup/country-of-issue');

  useEffect(() => {
    dispatch({ type: 'kyc/pullKycInfo' });
  }, []);

  if (loading) {
    return null;
  }

  switch (tenantConfig.kyc.siteRegion) {
    case 'global':
      return <KCKycHome onBack={handleBack} />;
    case 'australia':
      return <AUKycHome onBack={handleBack} />;
    case 'europe':
      return <EUKycHome onBack={handleBack} />;
    default:
      return null;
  }
}
