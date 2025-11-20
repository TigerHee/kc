/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import useKyc3Status from '../../KycHome/site/KC/hooks/useKyc3Status';

/** 平台的 kyc 数据和 kyc 中台的数据是两套，存在不一致的 case，需要兼容一下 */
const useCompatibleKyc1 = (kyc1) => {
  const { kycInfo } = useSelector((state) => state.kyc ?? {});
  const { kyc3Status, kyc3StatusEnum } = useKyc3Status();
  return useMemo(() => {
    let status = null;
    let failReasonList = [];
    switch (kyc3Status) {
      case kyc3StatusEnum.UNVERIFIED:
        status = KYC_STATUS_ENUM.UNVERIFIED;
        break;
      case kyc3StatusEnum.SUSPEND:
        status = KYC_STATUS_ENUM.SUSPEND;
        break;
      case kyc3StatusEnum.VERIFYING:
      case kyc3StatusEnum.FAKE:
        status = KYC_STATUS_ENUM.VERIFYING;
        break;
      case kyc3StatusEnum.VERIFIED:
        status = KYC_STATUS_ENUM.VERIFIED;
        break;
      case kyc3StatusEnum.REJECTED:
        status = KYC_STATUS_ENUM.REJECTED;
        // 平台状态为拒绝时，看 kyc 中台的状态是否也是拒绝
        // - 是则代表平台的状态是中台同步过来的，失败原因取中台数据
        // - 否则代表拒绝时平台的操作，取平台的数据
        failReasonList =
          kyc1.status === KYC_STATUS_ENUM.REJECTED
            ? kyc1.failReasonList
            : kycInfo.failureReasonLists;
        break;
      case kyc3StatusEnum.CLEARANCE:
      case kyc3StatusEnum.RESET:
        /** @todo 已打回和待打回还没落实怎么设计，暂时按失败处理 */
        status = KYC_STATUS_ENUM.REJECTED;
        break;
    }
    return { status, failReasonList };
  }, [kyc3Status, kyc3StatusEnum, kyc1, kycInfo]);
};

export default useCompatibleKyc1;
