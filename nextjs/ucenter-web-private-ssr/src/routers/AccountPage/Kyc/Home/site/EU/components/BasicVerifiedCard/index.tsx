import { Empty, Button } from '@kux/design';
import styles from './styles.module.scss';
import { push } from '@/utils/router';
import { bootConfig } from 'kc-next/boot';
import { _t } from '@/tools/i18n';
import { useSelector } from 'react-redux';
import { KYC_STATUS_ENUM } from '@/constants/kyc/enums';

export default function BasicVerifiedCard() {
  const { advanceResult, proUserResult } = useSelector((state: any) => state.kyc_eu ?? {});

  const isAdvanceVerified = advanceResult.status === KYC_STATUS_ENUM.VERIFIED;
  const isProUserVerified = proUserResult.status === KYC_STATUS_ENUM.VERIFIED;

  const handleCompleted = () => {
    push(`/assets/coin/${bootConfig._BASE_CURRENCY_}`);
  };

  return <div className={styles.container}>
    <div className={styles.verifiedContent}>
      <Empty
        name="success"
        size="small"
        title={
          <div className={styles.tag}>
            {
              isProUserVerified
                ? /** @todo */ 'Professional Investor Identity Verified'
                : isAdvanceVerified
                  ? /** @todo */ 'Advanced Identity Verified'
                  : /** @todo */ 'Basic Identity Verified'
            }
          </div>
        }
        description={/** @todo */ 'Welcome Aboard! Your KuCoin Adventure Starts Now'}
      />
      <Button
        type="outlined"
        onClick={handleCompleted}
      >
        {_t('45813def186c4800aa66')}
      </Button>
    </div>
  </div>;
};
