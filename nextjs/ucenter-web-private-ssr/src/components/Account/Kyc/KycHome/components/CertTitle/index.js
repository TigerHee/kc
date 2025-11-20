import { css, Tag, Tooltip, useTheme } from '@kux/mui';
import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { _t } from 'src/tools/i18n';
import FailureReason from '../../FailureReason';
import { GapBox, Title } from './styled';

const StatusTag = ({ status }) => {
  const style = css`
    line-height: 140%;
  `;
  switch (status) {
    case KYC_STATUS_ENUM.VERIFYING:
      return (
        <Tag css={style} color="complementary" size="small">
          {_t('aa73d295784f4000ac75')}
        </Tag>
      );
    case KYC_STATUS_ENUM.SUSPEND:
      return (
        <Tag css={style} color="complementary" size="small">
          {_t('89e10ef029244000a384')}
        </Tag>
      );
    case KYC_STATUS_ENUM.VERIFIED:
      return (
        <Tag css={style} color="primary" size="small">
          {_t('verified')}
        </Tag>
      );
    case KYC_STATUS_ENUM.REJECTED:
      return (
        <Tag css={style} color="secondary" size="small">
          {_t('f2b667e733954800a64e')}
        </Tag>
      );
    default:
      return null;
  }
};

const CheckReason = ({ status, failReasonList }) => {
  const theme = useTheme();
  const style = css`
    color: ${theme.colors.secondary};
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    line-height: 140%; /* 16.8px */
  `;
  if (status !== KYC_STATUS_ENUM.REJECTED) {
    return null;
  }
  return (
    <Tooltip title={<FailureReason failureReasonLists={failReasonList} />}>
      <u css={style}>{_t('11795d4672934800a0ec')}</u>
    </Tooltip>
  );
};

export default ({ status, title, failReasonList, hideReason = false }) => {
  return (
    <GapBox gap={8} dir="row" style={{ alignItems: 'center' }}>
      <Title>{title}</Title>
      <StatusTag status={status} />
      {!hideReason ? <CheckReason status={status} failReasonList={failReasonList} /> : null}
    </GapBox>
  );
};
