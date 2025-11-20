import useTheme from '@/hooks/useTheme';
import useTranslation from '@/hooks/useTranslation';
import { addLangToPath } from '@/tools/i18n';
import { Button, useResponsive } from '@kux/design';
import AnimatedContent from '../CommonComponents/Animations/AnimatedContent';
import styles from './styles.module.scss';

import tradeVideoDark from '@/static/trade/trade-dark.webm';
import tradeVideo from '@/static/trade/trade.webm';
import LazyVideo from '../CommonComponents/LazyVideo/index';

import tradeImg from '@/static/trade/trade.png';
import tradeImgDark from '@/static/trade/trade-dark.png';

export default () => {
  const { t } = useTranslation();
  const rs = useResponsive();
  const isSm = rs === 'sm';
  const { theme } = useTheme();

  return (
    <section className={styles.trade}>
      <AnimatedContent className={styles.tradeLeft}>
        <LazyVideo
          src={theme === 'dark' ? tradeVideoDark : tradeVideo}
          poster={theme === 'dark' ? tradeImgDark : tradeImg}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
        />
      </AnimatedContent>
      <div className={styles.tradeRight}>
        <AnimatedContent delay={0.2}>
          <h2>{t('e6bba3637b464000a438')}</h2>
        </AnimatedContent>
        <AnimatedContent delay={0.3}>
          <p>{t('73d2da2167ec4800a1d4')}</p>
        </AnimatedContent>
        <AnimatedContent delay={0.5}>
          <a href={addLangToPath('/trade')} target="_blank" rel="noopener noreferrer">
            <Button type="primary" size={isSm ? 'large' : 'huge'}>
              {t('3264893a4a464800a0db')}
            </Button>
          </a>
        </AnimatedContent>
      </div>
    </section>
  );
};
