/**
 * Owner: tiger@kupotech.com
 * KYC
 */
import { ComplianceDialog } from '@kucoin-gbiz-next/kyc';
import { Steps, styled, useSnackbar, useTheme } from '@kux/mui';
import VerifiedTag from 'components/Account/Kyc/common/VerifiedTag';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import KycIcon from 'components/Account/Kyc3/Home/KycStatusCard/components/KycIcon';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import KycWelfare from 'components/Account/Kyc3/Home/KycStatusCard/modules/KycWelfare';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { postFinanceChoose } from 'services/kyc';
import kyc_unverified from 'static/account/kyc/kyc3/kyc_unverified.png';
import kyc_unverified_dark from 'static/account/kyc/kyc3/kyc_unverified_dark.svg';
import kyc_verified from 'static/account/kyc/kyc3/kyc_verified.png';
import kyc_verified_dark from 'static/account/kyc/kyc3/kyc_verified_dark.svg';
import { _t } from 'tools/i18n';
import useKyc3Status from '../../hooks/useKyc3Status';
import usePIStatus from '../../hooks/usePIStatus';
import Rejected from './IdentityStatus/Rejected';
import Verified from './IdentityStatus/Verified';
import Verifying from './IdentityStatus/Verifying';
import PiRejected from './PIStatus/Rejected';
import PiUnverified from './PIStatus/Unverified';
import PiVerified from './PIStatus/Verified';
import PiVerifying from './PIStatus/Verifying';
import { PIWrapper, StepDesc, StepTitle, Wrapper } from './style';

const { Step } = Steps;

const CustomBaseTitle = styled(BaseTitle)`
  padding-top: 24px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-top: 0;
  }
`;

export default ({ onClickVerify }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { message } = useSnackbar();
  const { kyc3Status, kyc3StatusEnum, sensorStatus } = useKyc3Status();
  const { PIStatusEnum, PIStatus, PIComplianceInfo } = usePIStatus();
  // 当前 PI 认证进度
  const [currentStep, setCurrentStep] = useState(0);
  // PI 认证弹窗是否打开
  const [isPIVerifyOpen, setPIVerifyOpen] = useState(false);

  // 开始 PI 认证
  const onPIVerify = useCallback(() => {
    postFinanceChoose({
      kycType: 'KYC',
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
  const isIdentityVerified = useMemo(
    () => kyc3StatusEnum.VERIFIED === kyc3Status,
    [kyc3Status, kyc3StatusEnum.VERIFIED],
  );

  // PI 认证通过
  const isPIVerified = useMemo(() => {
    return PIStatus === PIStatusEnum.VERIFIED;
  }, [PIStatus, PIStatusEnum.VERIFIED]);

  useEffect(() => {
    if (isPIVerified) {
      setCurrentStep(2);
    } else {
      setCurrentStep(isIdentityVerified ? 1 : 0);
    }
  }, [isIdentityVerified, isPIVerified]);

  // 个人信息认证状态卡
  const IdentityStatusCard = useMemo(() => {
    if (!kyc3Status) {
      return null;
    }
    switch (kyc3Status) {
      case kyc3StatusEnum.FAKE:
        return <Verifying fake />;
      case kyc3StatusEnum.VERIFYING:
        return <Verifying />;
      case kyc3StatusEnum.VERIFIED:
        return <Verified sensorStatus={sensorStatus} />;
      default:
        return (
          <Rejected
            kyc3Status={kyc3Status}
            kyc3StatusEnum={kyc3StatusEnum}
            sensorStatus={sensorStatus}
            onClickVerify={onClickVerify}
          />
        );
    }
  }, [kyc3Status, kyc3StatusEnum, sensorStatus, onClickVerify]);

  // PI 认证状态卡
  const PIStatusCard = useMemo(() => {
    if (isIdentityVerified) {
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
  }, [isIdentityVerified, PIStatus, PIStatusEnum, onPIVerify, PIComplianceInfo]);

  const rightImg = useMemo(() => {
    const isThemeLight = theme.currentTheme === 'light';
    if (isIdentityVerified && isPIVerified) {
      return isThemeLight ? kyc_verified : kyc_verified_dark;
    }
    return isThemeLight ? kyc_unverified : kyc_unverified_dark;
  }, [theme, isIdentityVerified, isPIVerified]);

  return (
    <Wrapper>
      <BaseCard
        leftSlot={
          <>
            <CustomBaseTitle>{_t('e57ddb4efda64000afda')}</CustomBaseTitle>
            <BaseDescription>{_t('7958f9a925be4000a67b')}</BaseDescription>
            <KycWelfare />
          </>
        }
        rightSlot={<KycIcon src={rightImg} alt="status-icon" />}
        bottomSlot={
          <PIWrapper>
            <Steps current={currentStep} size="small" direction="vertical">
              <Step
                title={
                  <StepTitle>
                    <span>{_t('e57ddb4efda64000afda')}</span>
                    {isIdentityVerified && <VerifiedTag />}
                  </StepTitle>
                }
                description={IdentityStatusCard}
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
        }
      />
      <ComplianceDialog
        open={isPIVerifyOpen}
        onCancel={() => setPIVerifyOpen(false)}
        onOk={() => {
          setPIVerifyOpen(false);
          dispatch({
            type: 'kyc/pullFinanceList',
            payload: {
              kycType: 'KYC',
            },
          });
        }}
        theme={theme.currentTheme}
        complianceType={PIComplianceInfo?.standardWaitlist?.[0]}
      />
    </Wrapper>
  );
};
