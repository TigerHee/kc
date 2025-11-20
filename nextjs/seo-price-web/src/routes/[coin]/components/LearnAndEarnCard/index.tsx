/**
 * Owner: will.wang@kupotech.com
 */
import { addLangToPath } from 'src/tools/i18n';
import styles from './style.module.scss';
import useTranslation from '@/hooks/useTranslation';

import LearnImage from '@/assets/price/learn-and-earn.png';
import LearnLogo from '@/assets/price/learn-logo.png';
import { getSiteConfig } from 'kc-next/boot';


const LearnAndEarnCard = () => {
  const siteConfig = getSiteConfig()
  const { _t } = useTranslation();

  return (
    <section className={styles.wrapper} id="learn_and_earn_card">
      <a href={addLangToPath(`${siteConfig.KUCOIN_HOST}/learn-and-earn`)}>
        <img className={styles.logo} src={LearnLogo} alt="learn and earn logo" loading="lazy" />
        <header>
          <hgroup>
            <h2 className={styles.title}>{_t('fb0762f7363a4000a3c0')}</h2>
            <h3 className={styles.des}>{_t('a4a3ba5c96a64000a97a')}</h3>
          </hgroup>
        </header>
        <img className={styles.image} src={LearnImage} alt="learn and earn" loading="lazy" />
      </a>
    </section>
  );
};

export default LearnAndEarnCard;