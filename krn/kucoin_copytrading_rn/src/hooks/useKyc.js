/**
 * Owner: Ray.Lee@kupotech.com
 */
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {getKyc3TradeLimitInfo} from 'services/app';
import {useMutation} from './react-query';

const KYC_RESULT_DISPLAY_TYPE = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

/** 验证通过 KYC */
const validatePassAuthKyc = displayType =>
  displayType === KYC_RESULT_DISPLAY_TYPE.SUCCESS;

/**
 * 下单，平仓，开通期权
 */
const useKyc = () => {
  const dispatch = useDispatch();
  const {mutateAsync, data: resp} = useMutation({
    mutationFn: getKyc3TradeLimitInfo,
  });
  const getKycInfo = async () => {
    const params = {
      status: 'KYC_LIMIT',
    };

    return await mutateAsync(params);
  };

  const validateAndOpenKycInfo = async () => {
    const {data} = (await getKycInfo()) || {};

    return validatePassAuthKyc(data?.displayType);
  };
  useEffect(() => {
    if (validatePassAuthKyc(resp?.data?.displayType)) {
      return;
    }
    dispatch({
      type: 'app/update',
      payload: {
        kyc3TradeLimitInfo: resp?.data || {},
      },
    });
  }, [resp?.data, dispatch]);

  return {
    getKycInfo,
    validateAndOpenKycInfo,
  };
};

export default useKyc;
