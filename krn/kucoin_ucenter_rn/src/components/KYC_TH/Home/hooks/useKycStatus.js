/**
 * Owner: brick.fan@kupotech.com
 */
import {KRNEventEmitter} from '@krn/bridge';
import {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {kycStatusEnum} from '../config';
import isEmpty from 'lodash/isEmpty';

export default () => {
  const kycInfo = useSelector(s => s.kyc_th.kycInfo);
  const advanceStatusData = useSelector(s => s.kyc_th.advanceStatusData);
  const failReason = useSelector(
    s => s.kyc_th.verifyResult?.failReason?.filter(Boolean) || [],
  );
  const isLogin = useSelector(state => state.app.isLogin);
  const userChange = useSelector(state => state.app.userChange);
  const dispatch = useDispatch();

  const [advanceStatus, setAdvanceStatus] = useState(null);
  const [advVerifiedPending, setAdvVerifiedPending] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      if (userChange) {
        await dispatch({type: 'kyc_th/resetValues'});
      }
      if (isLogin) {
        // 获取 kyc/kyb 状态
        dispatch({type: 'kyc_th/pullKycInfo'});
        dispatch({type: 'kyc_th/pullAdvanceList'});
        // 获取权益
        dispatch({type: 'kyc_th/getPrivileges'});
      }
    };
    fetchAll();
    const subscription = KRNEventEmitter.addListener('onShow', fetchAll);
    return () => {
      subscription?.remove();
    };
  }, [isLogin, userChange]);

  const {status, loading} = useMemo(() => {
    if (Object.keys(kycInfo).length === 0) {
      return {status: '', loading: true};
    }

    let targetStatus = '';

    const {
      kycProcessStatus,
      kybProcessStatus,
      kycVerifyStatus,
      kybVerifyStatus,
      kycType,
    } = kycInfo;

    if (kycType === 'KYC') {
      if (kycVerifyStatus === 1) {
        targetStatus = kycStatusEnum.KYC_VERIFIED;
      } else if (kycVerifyStatus === 0) {
        if (kycProcessStatus === -1) {
          targetStatus = kycStatusEnum.UNVERIFIED;
        } else if (kycProcessStatus === 0) {
          targetStatus = kycStatusEnum.KYC_VERIFYING;
        } else if (kycProcessStatus === 1) {
          targetStatus = kycStatusEnum.KYC_REJECTED;
        }
      }
    } else {
      if (kybVerifyStatus === 1) {
        targetStatus = kycStatusEnum.KYB_VERIFIED;
      } else if (kybVerifyStatus === 0) {
        if (kybProcessStatus === -1) {
          targetStatus = kycStatusEnum.UNVERIFIED;
        } else if (kybProcessStatus === 0) {
          targetStatus = kycStatusEnum.KYB_VERIFYING;
        } else if (kybProcessStatus === 1) {
          targetStatus = kycStatusEnum.KYB_REJECTED;
        }
      }
    }

    return {
      status: targetStatus,
      loading: false,
    };
  }, [kycInfo]);

  useEffect(() => {
    // 失败后，请求失败原因

    if (status === kycStatusEnum.KYC_REJECTED) {
      dispatch({type: 'kyc_th/pullVerifyResult', payload: {type: 'kyc'}});
    } else if (status === kycStatusEnum.KYB_REJECTED) {
      dispatch({type: 'kyc_th/pullVerifyResult', payload: {type: 'kyb'}});
    }
  }, [status]);

  useEffect(() => {
    if (!isEmpty(advanceStatusData)) {
      const {
        status: curStatus,
        verifyStatus,
        advanceStatus: resAdvanceStatus,
      } = advanceStatusData;
      const verifyingStatusList = [0, 1, 8];

      setAdvVerifiedPending(false);
      if (resAdvanceStatus === 1) {
        setAdvanceStatus(kycStatusEnum.ADVANCE_VERIFIED);
        if (verifyingStatusList.includes(curStatus)) {
          setAdvVerifiedPending(true);
        }
      } else {
        if (verifyingStatusList.includes(curStatus)) {
          // 认证中
          setAdvanceStatus(kycStatusEnum.ADVANCE_VERIFYING);
        } else if ([9].includes(curStatus)) {
          if (verifyStatus) {
            // 认证成功
            setAdvanceStatus(kycStatusEnum.ADVANCE_VERIFIED);
          } else {
            // 认证失败
            setAdvanceStatus(kycStatusEnum.ADVANCE_REJECTED);
          }
        } else {
          // 未认证
          setAdvanceStatus(kycStatusEnum.ADVANCE_UNVERIFIED);
        }
      }
    }
  }, [advanceStatusData]);

  return {
    isFirstLoading: loading,
    status,
    failReason,
    advanceStatus,
    advVerifiedPending,
  };
};
