/**
 * Owner: tiger@kupotech.com
 */
// import loadable from '@loadable/component';
import ModalForbid from 'components/Tips/modalForbid';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTenantConfig } from '@/tenant';
import AccountLayout from '@/components/AccountLayout';
import KycKybPage from 'routers/AccountPage/Kyc/KycKybPage';
import KycKybPageV2 from 'routers/AccountPage/Kyc/KycKybPageV2';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';

// const KycKybPage = loadable(() => import('routers/AccountPage/Kyc/KycKybPage'));
// const KycKybPageV2 = loadable(() => import('routers/AccountPage/Kyc/KycKybPageV2'));

const Kyc = () => {
  const { isSub = false } = useSelector((state) => state.user.user) || {};
  const dispatch = useDispatch();
  const tenantConfig = getTenantConfig();

  useEffect(() => {
    dispatch({
      type: 'kyc/pullKycInfo',
    });
  }, []);

  return (
    <React.Fragment>
      {isSub && <ModalForbid />}
      {tenantConfig.kyc.upgrade ? <KycKybPageV2 /> : <KycKybPage />}
    </React.Fragment>
  );
};

const KycWithLayout = (props) => {
  return (
    <ErrorBoundary scene={SCENE_MAP.kyc.index}>
      <AccountLayout>
        <Kyc {...props} />
      </AccountLayout>
    </ErrorBoundary>
  );
};

export default KycWithLayout;
