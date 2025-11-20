/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ComplianceDialog } from '@kucoin-gbiz-next/kyc';
import { Steps, styled, useSnackbar, useTheme } from '@kux/mui';
import VerifiedTag from 'components/Account/Kyc/common/VerifiedTag';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { postFinanceChoose } from 'services/kyc';
import useKybStatus from 'src/routes/AccountPage/Kyc/hooks/useKybStatus';
import usePIStatus from 'src/routes/AccountPage/Kyc/KybHome/hooks/usePIStatus';
import { _t } from 'tools/i18n';
import Verified from './KybStatus/Verified';
import PiRejected from './PIStatus/Rejected';
import PiUnverified from './PIStatus/Unverified';
import PiVerified from './PIStatus/Verified';
import PiVerifying from './PIStatus/Verifying';
import { PIWrapper, StepDesc, StepTitle } from './styled';

const { Step } = Steps;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 16px;
`;

export default ({ identityStatus }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const { kybStatus, kybStatusEnum } = useKybStatus();
  const { PIStatusEnum, PIStatus, PIComplianceInfo } = usePIStatus();
  // 当前 PI 认证进度
  const [currentStep, setCurrentStep] = useState(0);
  // PI 认证弹窗是否打开
  const [isPIVerifyOpen, setPIVerifyOpen] = useState(false);

  // 开始 PI 认证
  const onPIVerify = useCallback(() => {
    postFinanceChoose({
      kycType: 'KYB',
      standardAlias: PIComplianceInfo?.standardWaitlist?.[0],
      financeComplianceType: PIComplianceInfo.type,
    })
      .then((res) => {
        setPIVerifyOpen(true);
      })
      .catch((err) => {
        err.msg && message.error(err.msg);
      });
  }, [PIComplianceInfo, message]);

  // 是否身份认证通过
  const isKybVerified = useMemo(
    () => kybStatusEnum.VERIFIED === kybStatus,
    [kybStatus, kybStatusEnum.VERIFIED],
  );

  // PI 认证通过
  const isPIVerified = useMemo(() => {
    return PIStatus === PIStatusEnum.VERIFIED;
  }, [PIStatus, PIStatusEnum.VERIFIED]);

  useEffect(() => {
    if (isPIVerified) {
      setCurrentStep(2);
    } else {
      setCurrentStep(isKybVerified ? 1 : 0);
    }
  }, [isKybVerified, isPIVerified]);

  // PI 认证状态卡
  const PIStatusCard = useMemo(() => {
    if (isKybVerified) {
      switch (PIStatus) {
        case PIStatusEnum.VERIFYING:
          return <PiVerifying />;
        case PIStatusEnum.VERIFIED:
          return <PiVerified />;
        case PIStatusEnum.REJECTED:
          return (
            <PiRejected
              onPIVerify={onPIVerify}
              failureReasonLists={PIComplianceInfo?.failedReason}
            />
          );
        default:
          return <PiUnverified onPIVerify={onPIVerify} />;
      }
    }
    return <StepDesc>{_t('f4ad443067954000a54a')}</StepDesc>;
  }, [isKybVerified, PIStatus, PIStatusEnum, onPIVerify, PIComplianceInfo]);

  return (
    <>
      <PIWrapper className="PIWrapper">
        <Steps current={currentStep} size="small" direction="vertical">
          <Step
            title={
              <StepTitle>
                <span>{_t('e57ddb4efda64000afda')}</span>
                {isKybVerified && <VerifiedTag />}
              </StepTitle>
            }
            description={
              kybStatus === kybStatusEnum.VERIFIED ? (
                <Verified />
              ) : (
                <>
                  <Description>{_t('5a1ff894e2854000a49c')}</Description>
                  {identityStatus}
                </>
              )
            }
          />
          <Step
            title={
              <StepTitle>
                <span>{_t('fe9978d0f98f4000a109')}</span>
                {isPIVerified && <VerifiedTag />}
              </StepTitle>
            }
            description={PIStatusCard}
          />
        </Steps>
      </PIWrapper>

      <ComplianceDialog
        open={isPIVerifyOpen}
        onCancel={() => setPIVerifyOpen(false)}
        onOk={() => {
          setPIVerifyOpen(false);
          dispatch({
            type: 'kyc/pullFinanceList',
            payload: {
              kycType: 'KYB',
            },
          });
        }}
        theme={theme.currentTheme}
        complianceType={PIComplianceInfo?.standardWaitlist?.[0]}
      />
    </>
  );
};
