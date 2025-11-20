/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ComplianceDialog } from 'gbiz-next/kyc';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KycStatusCardWrapper } from '../../../../components/commonUIs';
import { kycStatusEnum } from '../../constants';
import useKyc3Status from '../../hooks/useKyc3Status';
import CertificationDialog from '../CertificationDialog';
import Rejected from './Rejected';
import Unverified from './Unverified';
import Verified from './Verified';
import Verifying from './Verifying';

const KycStatusCardInner = ({ onClickVerify }) => {
  const { kyc3Status } = useKyc3Status();
  const dispatch = useDispatch();

  const failReason = useSelector((s) => s.kyc_th.verifyResult?.failReason?.filter(Boolean) || []);

  useEffect(() => {
    // 失败后，请求失败原因
    if (kyc3Status === kycStatusEnum.KYC_REJECTED) {
      dispatch({ type: 'kyc_th/pullVerifyResult', payload: { type: 'kyc' } });
    } else if (kyc3Status === kycStatusEnum.KYB_REJECTED) {
      dispatch({ type: 'kyc_th/pullVerifyResult', payload: { type: 'kyb' } });
    }
  }, [kyc3Status]);

  switch (kyc3Status) {
    case kycStatusEnum.UNVERIFIED:
      return <Unverified onClickVerify={onClickVerify} />;
    case kycStatusEnum.KYC_VERIFYING:
      return <Verifying />;
    case kycStatusEnum.KYB_VERIFYING:
      return <Verifying />;
    case kycStatusEnum.KYC_VERIFIED:
      return <Verified />;
    case kycStatusEnum.KYB_VERIFIED:
      return <Verified />;
    case kycStatusEnum.KYC_REJECTED:
      return <Rejected failureReasonLists={failReason} onClickVerify={onClickVerify} />;
    case kycStatusEnum.KYB_REJECTED:
      return <Rejected failureReasonLists={failReason} onClickVerify={onClickVerify} />;
    default:
      return null;
  }
};

export default function KycStatusCard() {
  const dispatch = useDispatch();
  const { advanceStatus } = useKyc3Status();
  const [dialgOpen, setDialogOpen] = useState(false);
  const [complianceDialogOpen, setComplianceDialogOpen] = useState(false);
  const [complianceType, setComplianceType] = useState('');

  const isAdvanceVerified = useMemo(
    () => [kycStatusEnum.ADVANCE_VERIFIED].includes(advanceStatus),
    [advanceStatus],
  );

  const handleCompliance = (type) => {
    setComplianceType(type);
    setComplianceDialogOpen(true);
  };

  const onClickVerify = () => {
    setDialogOpen(true);
  };

  return isAdvanceVerified ? null : (
    <KycStatusCardWrapper>
      <KycStatusCardInner onClickVerify={onClickVerify} />
      <CertificationDialog
        open={dialgOpen}
        onCompliance={handleCompliance}
        onCancel={() => setDialogOpen(false)}
      />
      <ComplianceDialog
        open={complianceDialogOpen}
        complianceType={complianceType}
        onCancel={() => setComplianceDialogOpen(false)}
        onOk={() => {
          dispatch({ type: 'kyc_th/pullKycInfo' });
          setComplianceDialogOpen(false);
          setDialogOpen(false);
        }}
      />
    </KycStatusCardWrapper>
  );
}
