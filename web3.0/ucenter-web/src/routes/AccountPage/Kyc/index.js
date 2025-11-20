/**
 * Owner: tiger@kupotech.com
 */
import loadable from '@loadable/component';
import ModalForbid from 'components/Tips/modalForbid';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tenantConfig } from 'src/config/tenant';

const KycKybPage = loadable(() => import('routes/AccountPage/Kyc/KycKybPage'));
const KycKybPageV2 = loadable(() => import('routes/AccountPage/Kyc/KycKybPageV2'));

const Kyc = () => {
  const { isSub = false } = useSelector((state) => state.user.user) || {};
  const dispatch = useDispatch();

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
export default Kyc;
