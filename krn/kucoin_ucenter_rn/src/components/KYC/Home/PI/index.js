import React, {useMemo, useState, useEffect, useCallback} from 'react';
import {openNative, showToast} from '@krn/bridge';
import useLang from 'hooks/useLang';
import {getNativeInfo} from 'utils/helper';
import Verified from './IdentityStatus/Verified';
import Rejected from './IdentityStatus/Rejected';
import Verifying from './IdentityStatus/Verifying';
import PiUnverified from './PIStatus/Unverified';
import PiVerifying from './PIStatus/Verifying';
import PiVerified from './PIStatus/Verified';
import PiRejected from './PIStatus/Rejected';
import usePIStatus from '../hooks/usePIStatus';
import useClickVerify from '../hooks/useClickVerify';
import {
  Wrapper,
  StepItem,
  StepItemHeader,
  StepIconBox,
  StepIcon,
  StepIconText,
  StepItemHeaderContent,
  StepItemHeaderTitle,
  VerifiedTag,
  SecurityIcon,
  VerifiedTagText,
  StepItemContentBox,
  StepItemContent,
  StepDesc,
  Line,
} from './style';
import useIconSrc from 'hooks/useIconSrc';
import {VerifyBox} from '../VerifyArea';
import {ImageVerified, VerifiedTitle, SubTitle} from '../style';
import {postFinanceChoose} from 'services/kyc';

export default ({kyc3Status, kyc3StatusEnum, trackStatus}) => {
  const {_t} = useLang();
  const {PIStatusEnum, PIStatus, PIComplianceInfo} = usePIStatus();
  const {onClickVerify} = useClickVerify({
    kyc3Status,
    kyc3StatusEnum,
    trackStatus,
  });
  const selectedIcon = useIconSrc('selected');
  const verifiedIcon = useIconSrc('verified');
  // 当前 PI 认证进度
  const [currentStep, setCurrentStep] = useState(0);

  // 是否身份认证通过
  const isIdentityVerified = useMemo(
    () => kyc3StatusEnum.VERIFIED === kyc3Status,
    [kyc3Status, kyc3StatusEnum.VERIFIED],
  );

  // PI 认证通过
  const isPIVerified = useMemo(() => {
    return PIStatus === PIStatusEnum.VERIFIED;
  }, [PIStatus, PIStatusEnum.VERIFIED]);

  // 开始 PI 认证
  const onPIVerify = useCallback(() => {
    postFinanceChoose({
      kycType: 'KYC',
      standardAlias: PIComplianceInfo?.standardWaitlist?.[0],
      financeComplianceType: PIComplianceInfo.type,
    })
      .then(async res => {
        const {webApiHost} = await getNativeInfo();
        const standardAlias = PIComplianceInfo?.standardWaitlist?.[0];
        const url = `https://${webApiHost}/account-compliance?complianceType=${standardAlias}&loading=2&dark=true&needLogin=true&appNeedLang=true`;
        openNative(`/link?url=${encodeURIComponent(url)}`);
      })
      .catch(err => {
        err.msg && showToast(err.msg);
      });
  }, [PIComplianceInfo]);

  useEffect(() => {
    if (isPIVerified) {
      setCurrentStep(2);
    } else {
      setCurrentStep(isIdentityVerified ? 1 : 0);
    }
  }, [isIdentityVerified, isPIVerified]);

  // 个人信息认证状态卡
  const IdentityStatusCard = useMemo(() => {
    switch (kyc3Status) {
      case kyc3StatusEnum.FAKE:
        return <Verifying fake />;
      case kyc3StatusEnum.VERIFYING:
        return <Verifying />;
      case kyc3StatusEnum.VERIFIED:
        return <Verified trackStatus={trackStatus} />;
      default:
        return (
          <Rejected
            kyc3Status={kyc3Status}
            kyc3StatusEnum={kyc3StatusEnum}
            trackStatus={trackStatus}
            onClickVerify={onClickVerify}
          />
        );
    }
  }, [kyc3Status, kyc3StatusEnum, trackStatus, onClickVerify]);

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
  }, [
    isIdentityVerified,
    PIStatus,
    PIStatusEnum,
    onPIVerify,
    PIComplianceInfo,
  ]);

  const stepList = [
    {
      stepIndex: 0,
      title: _t('e57ddb4efda64000afda'),
      content: IdentityStatusCard,
      isVerified: isIdentityVerified,
    },
    {
      stepIndex: 1,
      title: _t('fe9978d0f98f4000a109'),
      content: PIStatusCard,
      isVerified: isPIVerified,
    },
  ];

  return (
    <>
      {isIdentityVerified && isPIVerified ? (
        <VerifyBox>
          <ImageVerified source={verifiedIcon} autoRotateDisable />
          <VerifiedTitle>{_t('e57ddb4efda64000afda')}</VerifiedTitle>
          <SubTitle>{_t('7958f9a925be4000a67b')}</SubTitle>
        </VerifyBox>
      ) : null}

      <Wrapper>
        {stepList.map(({stepIndex, title, content, isVerified}, index) => {
          const isActive = stepIndex <= currentStep;
          const isComplete = stepIndex < currentStep;

          return (
            <StepItem key={title}>
              <StepItemHeader>
                <StepIconBox isActive={isActive}>
                  {isComplete ? (
                    <StepIcon source={selectedIcon} />
                  ) : (
                    <StepIconText>{index + 1}</StepIconText>
                  )}
                </StepIconBox>
                <StepItemHeaderContent>
                  <StepItemHeaderTitle>{title}</StepItemHeaderTitle>
                  {isVerified && (
                    <VerifiedTag>
                      <SecurityIcon
                        source={require('assets/common/verified.png')}
                        autoRotateDisable
                      />
                      <VerifiedTagText>
                        {_t('kyc.limits.title3')}
                      </VerifiedTagText>
                    </VerifiedTag>
                  )}
                </StepItemHeaderContent>
              </StepItemHeader>

              <StepItemContentBox>
                {index !== stepList.length - 1 && <Line />}
                <StepItemContent isLast={index === stepList.length - 1}>
                  {content}
                </StepItemContent>
              </StepItemContentBox>
            </StepItem>
          );
        })}
      </Wrapper>
    </>
  );
};
