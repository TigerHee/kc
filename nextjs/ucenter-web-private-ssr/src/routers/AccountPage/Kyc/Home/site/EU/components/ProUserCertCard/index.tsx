import styles from './styles.module.scss';
import FollowUp from '../FollowUp';
import { _t } from '@/tools/i18n';
import { useSelector } from 'react-redux';
import { KYC_STATUS_ENUM } from '@/constants/kyc/enums';

export default function ProUserCertCard() {

  const { advanceResult, proUserResult } = useSelector((state: any) => state.kyc_eu ?? {});

  /** @todo PI 认证的状态？ */
  return advanceResult.status === KYC_STATUS_ENUM.VERIFIED && proUserResult.status !== KYC_STATUS_ENUM.VERIFIED
    ? <div className={styles.container}>
      <div className={styles.title}>{/** @todo */ 'Unlock Higher derivative trading leverage'}</div>
      <div className={styles.subTitle}>{/** @todo */ 'Complete Professional Investor Verification'}</div>
      <div className={styles.desc}>{_t('2756631306784000afa0')}</div>
      <ul className={styles.list}>
        <li>
          <span>{_t('c656b631f7044000ad51')}</span>
        </li>
        <li>
          <span>{_t('6939e18235f44800a82b')}</span>
        </li>
        <li>
          <span>{_t('81c17b8c2e914800a0c7')}</span>
        </li>
      </ul>
      <div className={styles.divider} />
      <FollowUp />
    </div>
    : null;
};
