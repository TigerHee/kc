/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const kyc3StatusEnum = {
  // 未认证
  UNVERIFIED: 'UNVERIFIED',
  // 认证中
  VERIFYING: 'VERIFYING',
  // 假失败
  FAKE: 'FAKE',
  // 认证中断
  SUSPEND: 'SUSPEND',
  // 认证失败
  REJECTED: 'REJECTED',
  // 认证成功
  VERIFIED: 'VERIFIED',
  // 待打回
  CLEARANCE: 'CLEARANCE',
  // 已打回
  RESET: 'RESET',
};

export default () => {
  const [kyc3Status, setKyc3Status] = useState(null);
  const [sensorStatus, setSensorStatus] = useState(null);
  // kyc基础信息
  const kycInfo = useSelector((s) => s.kyc.kycInfo);
  const kycClearInfo = useSelector((s) => s.kyc.kycClearInfo);
  // 是否入过金
  const recharged = useSelector((state) => state.user?.recharged);

  useEffect(() => {
    if (Object.keys(kycInfo).length && Object.keys(kycClearInfo).length) {
      const { verifyStatus, regionType, primaryVerifyStatus, dismissCountryVerifyStatus } = kycInfo;
      const { clearStatus } = kycClearInfo;
      // 显示优先级：打回状态 > 认证状态
      // 打回状态 0-无需打回 1-待打回 2-已打回
      // 待打回
      if (clearStatus === 1) {
        setKyc3Status(kyc3StatusEnum.CLEARANCE);
        setSensorStatus(8);
      }
      // 已打回
      else if (clearStatus === 2) {
        setKyc3Status(kyc3StatusEnum.RESET);
        setSensorStatus(9);
      }
      // 认证中断（verifyStatus=-1且primaryVerifyStatus=1）
      else if (verifyStatus === -1 && primaryVerifyStatus === 1) {
        setKyc3Status(kyc3StatusEnum.SUSPEND);
        setSensorStatus(2);
      }
      // 未认证
      else if (verifyStatus === -1) {
        setKyc3Status(kyc3StatusEnum.UNVERIFIED);
        setSensorStatus(1);
      }
      // 假失败（verifyStatus=5（假失败）或（verifyStatus=1且regionType!=3(假失败)））
      else if (
        verifyStatus === 5 ||
        (verifyStatus === 1 && regionType !== 3 && dismissCountryVerifyStatus === 1)
      ) {
        setKyc3Status(kyc3StatusEnum.FAKE);
        setSensorStatus(4);
      }
      // 认证中（verifyStatus=0/3/6/7））
      else if ([0, 3, 6, 7].includes(verifyStatus)) {
        setKyc3Status(kyc3StatusEnum.VERIFYING);
        setSensorStatus(3);
      }
      // 认证成功
      else if (verifyStatus === 1) {
        setKyc3Status(kyc3StatusEnum.VERIFIED);
        if (recharged) {
          setSensorStatus(7);
        } else {
          setSensorStatus(6);
        }
      }
      // 认证失败
      else if ([2, 4, 8].includes(verifyStatus)) {
        setKyc3Status(kyc3StatusEnum.REJECTED);
        setSensorStatus(5);
      }
    }
  }, [kycInfo, kycClearInfo, recharged]);

  return {
    kyc3StatusEnum,
    kyc3Status,
    sensorStatus,
  };
};
