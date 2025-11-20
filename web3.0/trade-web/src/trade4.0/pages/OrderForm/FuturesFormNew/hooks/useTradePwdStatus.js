/**
 * Owner: garuda@kupotech.com
 * 验证交易密码的hooks 单独 copy 适配一份
 */
import { useCallback, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useSnackbar } from '@kux/mui/hooks';

import { useGetIsLogin, useGetUserInfo } from './useGetData';

import { isFuturesNew, _t } from '../builtinCommon';

export default function useTradePwdStatus() {
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const isLogin = useGetIsLogin();
  const { securityStatus } = useGetUserInfo();
  const isNeedVerify = useSelector((state) => state.security.needVerifyTradePwd);

  const setIsNeedVerify = useCallback(
    (nextIsNeedVerify) => {
      dispatch({
        type: 'security/update',
        payload: {
          needVerifyTradePwd: nextIsNeedVerify,
        },
      });
    },
    [dispatch],
  );

  const checkAfter = useRef(null);

  const setCheckAfter = useCallback((value) => {
    checkAfter.current = value;
  }, []);

  const checkVerify = useCallback(
    async (callback) => {
      if (!isLogin) {
        return -1;
      }
      let verifyType;
      try {
        const result1 = await dispatch({
          type: 'security/get_verify_type',
          payload: { bizType: 'EXCHANGE' },
        });
        verifyType = result1;
        console.log('result1 --->', result1);
        if (isFuturesNew() && (!verifyType || !verifyType.length)) {
          const result2 = await dispatch({
            type: 'security/get_verify_type',
            payload: { bizType: 'CONTRACT_TRADE' },
          });
          verifyType = result2;
        }
        console.log('verifyType --->', verifyType);
      } catch (e) {
        verifyType = null;
      }
      if (verifyType === null) {
        message.error(_t('trd.verify.init.fail'));
        return -1;
      }
      const nextIsNeedVerify = Boolean(verifyType?.length);
      setIsNeedVerify(nextIsNeedVerify);
      console.log('nextIsNeedVerify --->', nextIsNeedVerify);
      if (nextIsNeedVerify) {
        setCheckAfter(callback);
      } else {
        console.log('checkVerify --->', callback);
        callback && callback();
      }
      return nextIsNeedVerify;
    },
    [dispatch, isLogin, message, setCheckAfter, setIsNeedVerify],
  );

  return {
    checkVerify,
    isNeedVerify,
    setIsNeedVerify,
    checkAfter,
    setCheckAfter,
    hasPwd: securityStatus?.WITHDRAW_PASSWORD,
  };
}
