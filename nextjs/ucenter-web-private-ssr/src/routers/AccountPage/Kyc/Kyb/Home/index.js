/**
 * Owner: vijay.zhou@kupotech.com
 */
import loadable from '@loadable/component';
import { tenantConfig } from 'config/tenant';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PAGE_TYPE } from 'src/components/Account/Kyc/KycKybHome/constants';
import { saTrackForBiz } from 'src/utils/ga';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import AccountLayout from '@/components/AccountLayout';

const KCKybHome = loadable(() => import('./site/KC'));
const AUKybHome = loadable(() => import('./site/AU'));
const EUKybHome = loadable(() => import('./site/EU'));

const KybHome = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'kyc/pullKycInfo',
      payload: { type: PAGE_TYPE.institution.type },
    });
    saTrackForBiz({}, ['KYB']);
  }, []);

  switch (tenantConfig.kyc.siteRegion) {
    case 'global':
      return <KCKybHome {...props} />;
    case 'australia':
      return <AUKybHome {...props} />;
    case 'europe':
      return <EUKybHome {...props} />;
    default:
      return null;
  }
};

const KybHomeWithLayout = (props) => {
  return (
    <ErrorBoundary scene={SCENE_MAP.kyc.kyb_home}>
      <AccountLayout>
        <KybHome {...props} />
      </AccountLayout>
    </ErrorBoundary>
  );
};

export default KybHomeWithLayout;
