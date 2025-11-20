/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const kybStatusEnum = {
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
  const [kybStatus, setKybStatus] = useState(null);
  // kyb基础信息
  const { kybInfo } = useSelector((state) => state.kyc);

  useEffect(() => {
    if (Object.keys(kybInfo).length) {
      const { verifyStatus, regionType, dismissCountryVerifyStatus } = kybInfo;
      if ([1].includes(verifyStatus)) {
        if (regionType !== 3 && dismissCountryVerifyStatus === 1) {
          setKybStatus(kybStatusEnum.VERIFYING);
        } else {
          // 认证通过
          setKybStatus(kybStatusEnum.VERIFIED);
        }
      } else if ([0, 3].includes(verifyStatus)) {
        // 认证中
        setKybStatus(kybStatusEnum.VERIFYING);
      } else if ([2, 4].includes(verifyStatus)) {
        // 认证失败
        setKybStatus(kybStatusEnum.REJECTED);
      } else {
        //未认证
        setKybStatus(kybStatusEnum.UNVERIFIED);
      }
    }
  }, [kybInfo]);

  return {
    kybStatusEnum,
    kybStatus,
    isProxySubmission: kybInfo.isProxySubmission,
  };
};
