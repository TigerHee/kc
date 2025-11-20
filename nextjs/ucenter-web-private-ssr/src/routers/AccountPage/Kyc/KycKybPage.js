/**
 * Owner: tiger@kupotech.com
 */
import { getTenantConfig } from '@/tenant';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PAGE_TYPE, TYPE } from 'components/Account/Kyc/KycKybHome/constants';
import KybHome from './KybHome';
import KycHome from './KycHome';

const tenantConfig = getTenantConfig();

const Kyc = () => {
  const dispatch = useDispatch();
  const kycInfo = useSelector((state) => state.kyc.kycInfo);
  const { type } = kycInfo;

  const [pageType, setPageType] = useState(PAGE_TYPE.personal.code);

  useEffect(() => {
    if (type === TYPE.institution) {
      dispatch({
        type: 'kyc/pullKycInfo',
        payload: { type: 1 },
      });
      setPageType(PAGE_TYPE.institution.code);
    }
  }, [type]);

  const triggerType = () => {
    const nextPageType =
      pageType === PAGE_TYPE.institution.code
        ? PAGE_TYPE.personal.code
        : PAGE_TYPE.institution.code;

    dispatch({
      type: 'kyc/pullKycInfo',
      payload: {
        type: PAGE_TYPE[nextPageType].type,
      },
      callback: () => {
        setPageType(nextPageType);
      },
    });
  };

  useEffect(() => {
    if (tenantConfig.kyc.isOnlyKYB) {
      dispatch({
        type: 'kyc/pullKycInfo',
        payload: { type: 1 },
      });
    }
  }, []);

  return (
    <Fragment>
      {pageType === PAGE_TYPE.institution.code || tenantConfig.kyc.isOnlyKYB ? (
        <KybHome triggerType={triggerType} />
      ) : (
        <KycHome triggerType={triggerType} />
      )}
    </Fragment>
  );
};

export default Kyc;
