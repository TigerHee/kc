/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { searchToJson } from 'helper';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { kcsensorsManualExpose } from 'utils/ga';
import useClickVerify from '../../hooks/useClickVerify';
import useKyc3Status from '../../hooks/useKyc3Status';
import Rejected from './Rejected';
import Unverified from './Unverified';
import Verified from './Verified';
import Verifying from './Verifying';

const TRCard = ({ kyc3Status, kyc3StatusEnum, sensorStatus, onClickVerify }) => {
  const kycInfo = useSelector((s) => s.kyc?.kycInfo);
  // 土耳其站的状态是主站状态的子集，只有【未认证/认证中/认证失败/认证成功】
  // 当出现土耳其站没有，但主站有的状态，显示为【未认证】状态
  switch (kyc3Status) {
    case kyc3StatusEnum.UNVERIFIED:
      return <Unverified sensorStatus={sensorStatus} onClickVerify={onClickVerify} />;
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
    case kyc3StatusEnum.VERIFIED:
      return <Verified sensorStatus={sensorStatus} />;
    case kyc3StatusEnum.SUSPEND:
    case kyc3StatusEnum.FAKE:
    case kyc3StatusEnum.CLEARANCE:
    case kyc3StatusEnum.RESET:
      return <Unverified onClickVerify={onClickVerify} sensorStatus={sensorStatus} />;
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
const KycStatusCard = ({ setCurrentRoute, setShowModal }) => {
  const { kyc3Status, kyc3StatusEnum, sensorStatus } = useKyc3Status();
  const { onClickVerify } = useClickVerify({ setCurrentRoute, setShowModal });
  useEffect(() => {
    if (kyc3Status !== null) {
      kcsensorsManualExpose(['UserStatus', '1'], {
        soure: soure || '',
        kyc_homepage_status: sensorStatus,
      });
    }
  }, [kyc3Status, sensorStatus]);

  return (
    <KycStatusCardWrapper>
      <TRCard
        kyc3Status={kyc3Status}
        kyc3StatusEnum={kyc3StatusEnum}
        sensorStatus={sensorStatus}
        onClickVerify={onClickVerify}
      />
    </KycStatusCardWrapper>
  );
};

export default KycStatusCard;
