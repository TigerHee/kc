import useLocale from 'hooks/useLocale';
import { ICHookOutlined } from '@kux/icons';
import { useTheme } from '@kux/design';
import { _t, _tHTML } from 'src/tools/i18n';
import rewardDarkIconSrc from 'static/account/kyc/brandUpgrade/rewardIcon.dark.svg';
import rewardIconSrc from 'static/account/kyc/brandUpgrade/rewardIcon.svg';
import formatLocalLangNumber from 'routers/AccountPage/Kyc/utils/formatLocalLangNumber';
import useRewardAmount from 'routers/AccountPage/Kyc/hooks/useRewardAmount';
import { EU_KYC1_BENEFITS } from '@/constants/kyc/benefits';
import styles from './styles.module.scss';

const Benefit = () => {
  const { currentLang } = useLocale();
  const theme = useTheme();
  const isDark = theme === 'dark';
  const rewardAmount = useRewardAmount();

  const formatAmount = formatLocalLangNumber({
    data: rewardAmount,
    lang: currentLang,
    interceptDigits: 2,
  });

  const rewardMsg =
    rewardAmount > 0
      ? _tHTML('339b87a4f2944800a812', {
        amount: formatAmount,
        currency: 'USDT',
      })
      : null;

  return (
    <div className={styles.benefitBox}>
      <div className={styles.unlockBox}>
        {rewardMsg ? (
          <div className={styles.rewardMsg}>
            <img src={isDark ? rewardDarkIconSrc : rewardIconSrc} alt="icon" />
            <p>{rewardMsg}</p>
          </div>
        ) : null}
        <div className={styles.unlockInfos}>
          <div>{_t('9524c661b3304000ab4c')}</div>
          <ul>
            {EU_KYC1_BENEFITS().map((info) => {
              return (
                <li key={info}>
                  <ICHookOutlined size={14} />
                  {info}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.collectBox}>
        <div>{_t('25aa644f1a0d4000ac7a')}</div>
        <div className={styles.collectList}>
          <div className={styles.collectItem}>
            <div className={styles.collectStepNum}>1</div>
            <div className={styles.collectStepContent}>
              <div className={styles.collectStepTitle}>{/** @todo */ 'Identity Verification'}</div>
              <div className={styles.collectStepDesc}>{/** @todo */ 'We will collect'}</div>
              <ul className={styles.collectStepList}>
                <li>
                  <span>{_t('8a5769cf4cc54800ae5b')}</span>
                </li>
                <li>
                  <span>{_t('f9b43fd2ffdf4000a6c5')}</span>
                </li>
                <li>
                  <span>{_t('20a114176fde4000a093')}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.collectItem}>
            <div className={styles.collectStepNum}>2</div>
            <div className={styles.collectStepContent}>
              <div className={styles.collectStepTitle}>{/** @todo */ 'Additional Questions'}</div>

            </div>
          </div>
          <div className={styles.collectItem}>
            <div className={styles.collectStepNum}>3</div>
            <div className={styles.collectStepContent}>
              <div className={styles.collectStepTitle}>{/** @todo */ 'Tax Information'}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Benefit;
