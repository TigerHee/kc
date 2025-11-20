/**
 * Owner: charles.yang@kupotech.com
 */
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const useInitTradePassword = () => {
  const dispatch = useDispatch();
  const getResult = useCallback(async () => {
    const result = await dispatch({
      type: 'security/get_verify_type',
      payload: { bizType: 'CONTRACT_TRADE' },
    });
    const checkStatus = Boolean((result || []).length);
    return !checkStatus;
  }, [dispatch]);

  return {
    getPasswordStatus: getResult,
  };
};

export default useInitTradePassword;
