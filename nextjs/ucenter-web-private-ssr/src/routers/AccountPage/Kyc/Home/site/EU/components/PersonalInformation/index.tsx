import { useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { _t } from '@/tools/i18n';
import { push } from '@/utils/router';
import useKyc3Status from 'routers/AccountPage/Kyc/KycHome/site/KC/hooks/useKyc3Status';

export default function PersonalInformation() {
  const { kycInfo } = useSelector((state: any) => state.kyc ?? {});
  const { user } = useSelector((state: any) => state.user ?? {});
  const { kyc3Status, kyc3StatusEnum } = useKyc3Status();

  const isBasicVerified = kyc3Status === kyc3StatusEnum.VERIFIED;

  const infoList = [
    {
      label: _t('name'),
      value: `${kycInfo?.firstName || ''} ${kycInfo?.lastName || ''}`,
    },
    {
      label: _t('c03122c2e1874000aa3a'),
      value: kycInfo?.birthday || '-',
    },
    {
      label: _t('f08397bed5e64000a76c'),
      value: `${kycInfo?.identityTypeDesc ? `${kycInfo?.identityTypeDesc}, ` : ''}${
        kycInfo?.identityNumber || ''
      }`,
    },
    {
      label: user?.email ? _t('iDWAuLLQhR4DzXSKETcgFL') : _t('peSc7tgoujgXJTCNeeAZkR'), // 展示邮箱或者手机
      value: user?.email ? user?.email : user?.phone,
    },
    {
      label: _t('identity.country'),
      value: kycInfo?.regionName,
    },
  ];

  return isBasicVerified
    ? <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{_t('6jRRR6sAzWZT5ceQxwoGQY')}</div>
        <div className={styles.update} onClick={() => push('/account/kyc/update')}>{_t('885e29ab7b614800abb2')}</div>
      </div>
      <div className={styles.content}>
        {infoList.map((item) => {
          const { label, value } = item;
          return (
            <div key={value}>
              <span>{label}</span>
              <span>{value}</span>
            </div>
          );
        })}
      </div>
    </div>
    : null;
};
