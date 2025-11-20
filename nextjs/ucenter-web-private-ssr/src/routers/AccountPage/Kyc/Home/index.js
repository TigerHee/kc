/**
 * Owner: vijay.zhou@kupotech.com
 * 根据站点渲染对应的组件
 */
import loadable from '@loadable/component';
import { tenantConfig } from 'config/tenant';
import { isEmpty } from 'lodash-es';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useKycSiteModel from 'src/hooks/useKycSiteModel';
import { push } from '@/utils/router';
import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import { Spin, styled } from '@kux/mui';

const KCKycHome = loadable(() => import('./site/KC'));
const AUKycHome = loadable(() => import('./site/AU'));
const EUKycHome = loadable(() => import('./site/EU'));

const LoadingBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .KuxSpin-root {
    align-self: center;
  }
`;

function KycHome() {
  const dispatch = useDispatch();
  const kycInfo = useSelector((state) => state.kyc?.kycInfo);
  const { loading: modelLoading } = useKycSiteModel();

  const loading = modelLoading || isEmpty(kycInfo);
  const handleBack = () => push('/account/kyc/setup/country-of-issue');

  useEffect(() => {
    dispatch({ type: 'kyc/pullKycInfo' });
  }, []);

  if (loading) {
    return <LoadingBox>
      <Spin spinning size="small" />
    </LoadingBox>;
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

export default function KycHomeWithLayout() {
  return (
    <ErrorBoundary scene={SCENE_MAP.kyc.kyc_home}>
      <AccountLayout>
        <KycHome />
      </AccountLayout>
    </ErrorBoundary>
  );
};
