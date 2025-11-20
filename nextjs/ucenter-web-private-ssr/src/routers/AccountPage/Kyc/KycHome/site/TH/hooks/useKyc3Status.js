/**
 * Owner: vijay.zhou@kupotech.com
 */
import { isEmpty } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { kycStatusEnum } from '../constants';

const useKyc3Status = () => {
  const { isLogin } = useSelector((state) => state.user);
  const { kycInfo, advanceStatusData } = useSelector((state) => state.kyc_th);

  const [advanceStatus, setAdvanceStatus] = useState(null);
  const [advVerifiedPending, setAdvVerifiedPending] = useState(false);

  // 基础认证状态
  const status = useMemo(() => {
    if (!isLogin || isEmpty(kycInfo)) {
      return '';
    }

    let targetStatus = '';

    const { kycProcessStatus, kycVerifyStatus, kybProcessStatus, kybVerifyStatus, kycType } =
      kycInfo;

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

    return targetStatus;
  }, [kycInfo, isLogin]);

  useEffect(() => {
    if (!isEmpty(advanceStatusData)) {
      const {
        status: curStatus,
        verifyStatus,
        advanceStatus: resAdvanceStatus,
      } = advanceStatusData || {};
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

  return { kycInfo, kyc3Status: status, advanceStatus, advVerifiedPending };
};

export default useKyc3Status;
