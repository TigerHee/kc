/**
 * Owner: vijay.zhou@kupotech.com
 */
import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { _t } from 'src/tools/i18n';
import { ExTag } from './styled';

export const StatusTag = ({ status }) => {
  return status === KYC_STATUS_ENUM.SUSPEND ? (
    <ExTag color="complementary">{_t('89e10ef029244000a384')}</ExTag>
  ) : status === KYC_STATUS_ENUM.VERIFYING ? (
    <ExTag color="complementary">{_t('a90983f924404800a3b8')}</ExTag>
  ) : status === KYC_STATUS_ENUM.REJECTED ? (
    <ExTag color="secondary">{_t('12807d730f894000a9fe')}</ExTag>
  ) : status === KYC_STATUS_ENUM.VERIFIED ? (
    <ExTag>{_t('460cb69b03104000a1fc')}</ExTag>
  ) : null;
};
