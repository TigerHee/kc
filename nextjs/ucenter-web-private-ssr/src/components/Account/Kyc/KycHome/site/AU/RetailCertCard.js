/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowRight2Outlined } from '@kux/icons';
import { Button, styled, Tooltip } from '@kux/mui';
import { useEffect, useMemo, useState } from 'react';
import { tenantConfig } from 'src/config/tenant';
import { AU_KYC2_BENEFITS } from 'src/constants/kyc/benefits';
import { KYC_ROLE_ENUM, KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { addLangToPath, _t } from 'src/tools/i18n';
import derivativeSrc from 'static/account/kyc/au/derivative.svg';
import knowledgeSrc from 'static/account/kyc/au/knowledge.svg';
import WaitIcon from 'static/account/kyc/kyb/wait_icon.svg';
import InfoList from '../../components/InfoList';
import Unlock from '../../components/Unlock';
import FailureReason from '../../FailureReason';
import { createCountdown } from '../../utils/createCountdown';
import AdvancedStatement from './AdvancedStatement';
import { ButtonWrapper, ErrorIcon, InfoIcon, SuccessIcon, WarningAlert } from './styled';
import { VerifyButton } from './VerifyButton';

const LIST = [
  { title: _t('857aaa9042ac4800abcb'), iconSrc: knowledgeSrc },
  { title: _t('ececbc2ef5714000acbe'), iconSrc: derivativeSrc },
];

const ErrorMessage = styled.div`
  padding-left: 24px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
`;

const RejectedAlert = ({ status, failReasonList = [] }) => {
  return status === KYC_STATUS_ENUM.REJECTED ? (
    <>
      <span>{_t('90c660955c4f4800af89')}</span>&nbsp;
      <Tooltip title={<FailureReason failureReasonLists={failReasonList} />}>
        <u>{_t('11795d4672934800a0ec')}</u>
      </Tooltip>
    </>
  ) : null;
};

export default function RetailCertCard({
  role,
  status,
  failReasonList,
  extraInfo,
  onVerify,
  isWholesale,
}) {
  const [kyc2BtnDisabled, setKyc2BtnDisabled] = useState(false);

  const isCompleted = status === KYC_STATUS_ENUM.VERIFIED;
  const isRejected = status === KYC_STATUS_ENUM.REJECTED;

  const list = useMemo(() => {
    return LIST.map((item, index) => {
      const { failedIndex = -1 } = extraInfo || {};
      const isFailed = failedIndex === index;
      return {
        title: item.title,
        icon:
          isRejected && failedIndex >= index ? (
            isFailed ? (
              <ErrorIcon />
            ) : (
              <SuccessIcon />
            )
          ) : (
            <InfoIcon src={item.iconSrc} />
          ),
        desc: isFailed ? (
          <ErrorMessage>
            <RejectedAlert status={status} failReasonList={failReasonList} />
          </ErrorMessage>
        ) : null,
      };
    });
  }, [isRejected, status, failReasonList, extraInfo]);

  useEffect(() => {
    if (role !== KYC_ROLE_ENUM.RETAIL) {
      return;
    }
    if (extraInfo?.unlockSeconds > 0) {
      setKyc2BtnDisabled(true);
      const { cancel } = createCountdown({
        seconds: extraInfo.unlockSeconds,
        callback: (cd) => {
          if (cd.done) {
            setKyc2BtnDisabled(false);
          }
        },
      });
      return cancel;
    }
  }, [extraInfo, role]);

  return (
    <>
      <Unlock locking={!isCompleted} list={AU_KYC2_BENEFITS()}>
        {status === KYC_STATUS_ENUM.VERIFYING ? (
          <WarningAlert>
            <img width={22} src={WaitIcon} alt="icon" />
            <span>{_t('2000532fd9fa4000a6dc')}</span>
          </WarningAlert>
        ) : !isCompleted ? (
          <InfoList list={list} />
        ) : null}
        {!kyc2BtnDisabled &&
        [KYC_STATUS_ENUM.UNVERIFIED, KYC_STATUS_ENUM.SUSPEND, KYC_STATUS_ENUM.REJECTED].includes(
          status,
        ) ? (
            <ButtonWrapper>
              <VerifyButton
                type={isWholesale ? 'default' : 'primary'}
                status={status}
                onClick={onVerify}
              />
            </ButtonWrapper>
          ) : null}
        {isCompleted ? (
          <ButtonWrapper>
            <Button
              variant="outlined"
              onClick={() =>
                (window.location.href = addLangToPath(tenantConfig.account.featureTradeUrl))
              }
            >
              <span>{_t('b25a376c082f4000a1ab')}</span>
              <ICArrowRight2Outlined size={16} />
            </Button>
          </ButtonWrapper>
        ) : null}
      </Unlock>
      <AdvancedStatement />
    </>
  );
}
