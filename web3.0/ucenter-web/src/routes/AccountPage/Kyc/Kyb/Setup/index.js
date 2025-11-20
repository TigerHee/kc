/**
 * Owner: vijay.zhou@kupotech.com
 */
import loadable from '@loadable/component';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { PAGE_TYPE } from 'src/components/Account/Kyc/KycKybHome/constants';
import { tenantConfig } from 'src/config/tenant';
import { replace } from 'utils/router';
import useKybStatus from '../../hooks/useKybStatus';

const KCKybSetup = loadable(() => import('./site/KC'));
const AUKybSetup = loadable(() => import('./site/AU'));
const EUKybSetup = loadable(() => import('./site/EU'));

const KybSetup = ({ loading, dispatch, ...props }) => {
  const { kybStatus, kybStatusEnum } = useKybStatus();

  useEffect(() => {
    dispatch({
      type: 'kyc/pullKycInfo',
      payload: { type: PAGE_TYPE.institution.type },
    });
  }, []);

  useEffect(() => {
    if (!loading && kybStatus) {
      if ([kybStatusEnum.VERIFYING, kybStatusEnum.VERIFIED].includes(kybStatus)) {
        replace('/account/kyb/home');
      }
    }
  }, [loading, kybStatus, kybStatusEnum]);

  if (loading) {
    return null;
  }

  switch (tenantConfig.kyc.siteRegion) {
    case 'global':
      return <KCKybSetup {...props} />;
    case 'australia':
      return <AUKybSetup {...props} />;
    case 'europe':
      return <EUKybSetup {...props} />;
    default:
      return null;
  }
};

export default connect(({ loading }) => ({
  loading: loading.effects['kyc/pullKycInfo'],
}))(KybSetup);
