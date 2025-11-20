/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { searchToJson } from 'helper';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { kcsensorsManualExpose } from 'utils/ga';
import useKyc3Status from '../../hooks/useKyc3Status';
import PI from '../PI';
import Clearance from './Clearance';
import Rejected from './Rejected';
import Suspend from './Suspend';
import Unverified from './Unverified';
import Verified from './Verified';
import Verifying from './Verifying';

const GlobalCard = ({ kyc3Status, kyc3StatusEnum, sensorStatus, onClickVerify }) => {
  const kycInfo = useSelector((s) => s.kyc?.kycInfo);
  switch (kyc3Status) {
    case kyc3StatusEnum.UNVERIFIED:
      return <Unverified sensorStatus={sensorStatus} onClickVerify={onClickVerify} />;
    case kyc3StatusEnum.FAKE:
      return <Verifying fake />;
    case kyc3StatusEnum.VERIFYING:
      return <Verifying />;
    case kyc3StatusEnum.REJECTED:
      return (
        <Rejected
          sensorStatus={sensorStatus}
          onClickVerify={onClickVerify}
          failureReasonLists={kycInfo?.failureReasonLists}
        />
      );
    case kyc3StatusEnum.SUSPEND:
      return <Suspend sensorStatus={sensorStatus} onClickVerify={onClickVerify} />;
    case kyc3StatusEnum.VERIFIED:
      return <Verified sensorStatus={sensorStatus} />;
    case kyc3StatusEnum.CLEARANCE:
    case kyc3StatusEnum.RESET:
      return <Clearance onClickVerify={onClickVerify} sensorStatus={sensorStatus} />;
    default:
      return null;
  }
};

const KycStatusCardWrapper = styled.div`
  margin-bottom: 28px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;

const { soure } = searchToJson();

// kyc首页认证状态卡片
const KycStatusCard = ({ onClickVerify }) => {
  const dispatch = useDispatch();
  const { kyc3Status, kyc3StatusEnum, sensorStatus } = useKyc3Status();
  const financeListKYC = useSelector((s) => s.kyc.financeListKYC);

  // 是否展示 PI 流程
  const isShowPI = useMemo(() => {
    return financeListKYC?.length > 0;
  }, [financeListKYC]);

  useEffect(() => {
    if (kyc3Status !== null) {
      kcsensorsManualExpose(['UserStatus', '1'], {
        soure: soure || '',
        kyc_homepage_status: sensorStatus,
      });
    }
  }, [kyc3Status, sensorStatus]);

  useEffect(() => {
    if (kyc3Status && kyc3Status !== kyc3StatusEnum.UNVERIFIED) {
      dispatch({
        type: 'kyc/pullFinanceList',
        payload: {
          kycType: 'KYC',
        },
      });
    }
  }, [kyc3Status, kyc3StatusEnum, dispatch]);

  return (
    <KycStatusCardWrapper>
      {isShowPI ? (
        <PI onClickVerify={onClickVerify} />
      ) : (
        <GlobalCard
          kyc3Status={kyc3Status}
          kyc3StatusEnum={kyc3StatusEnum}
          sensorStatus={sensorStatus}
          onClickVerify={onClickVerify}
        />
      )}
    </KycStatusCardWrapper>
  );
};

export default KycStatusCard;
