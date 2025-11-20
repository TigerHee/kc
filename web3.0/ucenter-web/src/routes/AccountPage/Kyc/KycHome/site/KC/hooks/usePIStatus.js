/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PIStatusEnum = {
  // 未认证
  UNVERIFIED: 'UNVERIFIED',
  // 认证中
  VERIFYING: 'VERIFYING',
  // 认证失败
  REJECTED: 'REJECTED',
  // 认证成功
  VERIFIED: 'VERIFIED',
};

export default () => {
  const financeListKYC = useSelector((s) => s.kyc.financeListKYC);
  const [PIStatus, setPIStatus] = useState(null);
  const [PIComplianceInfo, setPIComplianceInfo] = useState({});

  useEffect(() => {
    const item = financeListKYC[0];
    if (item) {
      setPIComplianceInfo(item);
      const { status, verifyStatus } = item;
      if ([0, 1, 8].includes(status)) {
        // 认证中
        setPIStatus(PIStatusEnum.VERIFYING);
      } else if ([9].includes(status)) {
        if (verifyStatus) {
          // 认证成功
          setPIStatus(PIStatusEnum.VERIFIED);
        } else {
          // 认证失败
          setPIStatus(PIStatusEnum.REJECTED);
        }
      } else {
        // 未认证
        setPIStatus(PIStatusEnum.UNVERIFIED);
      }
    }
  }, [financeListKYC]);

  return {
    PIStatusEnum,
    PIStatus,
    PIComplianceInfo,
  };
};
