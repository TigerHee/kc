/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ComplianceDialog } from 'gbiz-next/kyc';
import { Button, useTheme } from '@kux/design';
import { KYC_STATUS_ENUM } from '@/constants/kyc/enums';
import { useSelector, useDispatch } from 'react-redux';
import useKyc3Status from 'routers/AccountPage/Kyc/KycHome/site/KC/hooks/useKyc3Status';
import styles from './styles.module.scss';
import { useState } from 'react';

export default function AdvanceCertCard() {
  const { kyc3Status, kyc3StatusEnum } = useKyc3Status();
  const { advanceResult } = useSelector((state: any) => state.kyc_eu ?? {});
  const loading = useSelector((state: any) => state.loading.effects['kyc_eu/pullAdvanceResult'] || state.loading.effects['kyc_eu/pullAdvanceStandardAlias'] || state.loading.effects['kyc_eu/cancelAdvanceCert']);
  const isBasicVerified = kyc3Status === kyc3StatusEnum.VERIFIED;
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [complianceType, setComplianceType] = useState('');
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleVerify = async () => {
    const standardAlias = await dispatch({ type: 'kyc_eu/pullAdvanceStandardAlias' });
    setComplianceType(standardAlias as unknown as string);
    setComplianceOpen(true);
  };

  return isBasicVerified && advanceResult.status !== KYC_STATUS_ENUM.VERIFIED
    ? (
      <div className={styles.container}>
        <div className={styles.title}>
          <span>{/** @todo */ 'Unlock derivatives trading'}</span>
          <div className={styles.desc}>{/** @todo */ 'Complete a test and upload proof of address to unlock derivatives trading.'}</div>
        </div>
        <div>
          <Button type="primary" loading={loading} onClick={handleVerify}>{/** @todo */ 'Start Advanced Verification'}</Button>
        </div>
        <ComplianceDialog
          open={complianceOpen}
          onCancel={() => {
            setComplianceOpen(false);
            dispatch({ type: 'kyc_eu/pullAdvanceResult' });
          }}
          theme={theme}
          complianceType={complianceType}
        />
      </div>
    )
    : null;
};
