import { ICArrowRight2Outlined, ICHookOutlined } from '@kux/icons';
import { isFunction } from 'lodash-es';
import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { _t } from 'src/tools/i18n';
import ErrorIcon from 'static/account/kyc/kyc3/alert_error.svg';
import warningIcon from 'static/account/kyc/kyc3/alert_warning.svg';
import FailureReason from '../../FailureReason';
import {
  BenefitItem,
  BenefitList,
  CollectInfoBox,
  Content,
  Divider,
  ExButton,
  GapBox,
  Icon,
  RejectReasonBox,
  WarningBox,
} from './styled';

export default ({
  status,
  benefits = [],
  collectInfoTitle,
  collectInfos = [],
  disabled,
  loading,
  completedBtnText,
  onCompleted,
  onVerify,
  extraBtn,
  failReasonList,
  suspendMsg,
}) => {
  const isVerified = status === KYC_STATUS_ENUM.VERIFIED;
  const canVerify = [
    KYC_STATUS_ENUM.UNVERIFIED,
    KYC_STATUS_ENUM.SUSPEND,
    KYC_STATUS_ENUM.REJECTED,
  ].includes(status);
  return (
    <Content>
      <BenefitList>
        {!isVerified ? (
          <span>{_t('9524c661b3304000ab4c')}</span>
        ) : (
          <span>{_t('2c0fc90c02114000a11a')}</span>
        )}
        <div>
          {benefits.map((benefit) => (
            <BenefitItem key={benefit}>
              <ICHookOutlined size={16} />
              {benefit}
            </BenefitItem>
          ))}
        </div>
      </BenefitList>

      {!disabled && canVerify ? (
        <>
          <Divider />
          <CollectInfoBox>
            <span>{collectInfoTitle || _t('25aa644f1a0d4000ac7a')}</span>
            <ul>
              {collectInfos.map((info) => (
                <li key={info}>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </CollectInfoBox>
        </>
      ) : null}

      {!disabled && status === KYC_STATUS_ENUM.VERIFYING ? (
        <WarningBox gap={8}>
          <GapBox dir="row" gap={4}>
            <Icon src={warningIcon} />
            {_t('aa73d295784f4000ac75')}
          </GapBox>
          <span>{_t('e998b03ef5b94000a0c3')}</span>
        </WarningBox>
      ) : null}
      {!disabled && status === KYC_STATUS_ENUM.SUSPEND ? (
        <WarningBox gap={8}>
          <GapBox dir="row" gap={4}>
            <Icon src={warningIcon} />
            {_t('89e10ef029244000a384')}
          </GapBox>
          <span>{suspendMsg || _t('917141689c944000ac18')}</span>
        </WarningBox>
      ) : null}

      {!disabled && status === KYC_STATUS_ENUM.REJECTED ? (
        <RejectReasonBox gap={8}>
          <GapBox dir="row" gap={4} style={{ alignItems: 'center' }}>
            <Icon src={ErrorIcon} />
            {_t('1c06147f70d74800a0e2')}
          </GapBox>
          <div className="rejectContent">
            <FailureReason failureReasonLists={failReasonList} />
          </div>
        </RejectReasonBox>
      ) : null}

      {!disabled && canVerify && isFunction(onVerify) ? (
        <div>
          <ExButton loading={loading} onClick={onVerify}>
            {status === KYC_STATUS_ENUM.SUSPEND ? (
              <span>{_t('c259d5c7e7dd4000a753')}</span>
            ) : status === KYC_STATUS_ENUM.REJECTED ? (
              <span>{_t('48a040550a384000af48')}</span>
            ) : (
              <span>{_t('5dad5f1f450e4000a437')}</span>
            )}

            <ICArrowRight2Outlined size={16} />
          </ExButton>
        </div>
      ) : null}

      {!disabled && canVerify && extraBtn ? extraBtn : null}

      {!disabled && isVerified && completedBtnText ? (
        <div>
          <ExButton variant="outlined" onClick={onCompleted}>
            <span>{completedBtnText}</span>
          </ExButton>
        </div>
      ) : null}
    </Content>
  );
};
