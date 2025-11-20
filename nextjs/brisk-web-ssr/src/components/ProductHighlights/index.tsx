import clsx from 'clsx';
import { isEmpty } from 'lodash-es';
import useTheme from '@/hooks/useTheme';
import { useConfigStore } from '@/store/config';
import useTranslation from '@/hooks/useTranslation';
import card2 from '@/static/product/card2.png';
import card2Light from '@/static/product/card2-light.png';
import card3 from '@/static/product/card3.webp';
import card3Light from '@/static/product/card3-light.webp';
import styles from './styles.module.scss';
import AnimatedContent from '../CommonComponents/Animations/AnimatedContent';
import { calculateDelayTime } from '../CommonComponents/Animations/AnimatedContent/utils';

const CONFIG_TITLE = 'web202508homepageProductIntro';

export default () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const isLight = theme === 'light';

  const configItems = useConfigStore(store => store.configItems);
  const coinCount = configItems?.webHomepageData?.backupValues?.Coins;
  const data = configItems?.[CONFIG_TITLE]?.backupValues || {};

  const list = [
    {
      title: data.part1_title,
      desc: data.part1_content,
      isShowIcon: true,
    },
    {
      title: data.part2_title,
      desc: data.part2_content,
      contentBg: isLight ? card2Light : card2,
    },
    {
      title: data.part3_title,
      desc: data.part3_content,
      cardBg: isLight ? card3Light : card3,
    },
  ];

  return isEmpty(data) ? null : (
    <section className={styles.product}>
      <AnimatedContent>
        <div className={styles.desc}>{t('4e3c3d56e2284000a9dc')}</div>
        <h2 className={styles.title}>{t('8cfb814d71ba4000afbd')}</h2>
      </AnimatedContent>

      <div className={styles.cards}>
        {list.map(({ title, desc, isShowIcon, cardBg, contentBg }, index) => {
          const delay = calculateDelayTime(index, 0.2, 0.2);
          return (
            <AnimatedContent key={index} delay={delay} className={clsx([styles.cardWrapper])}>
              <div
                className={clsx({
                  [styles.card]: true,
                  [styles[`card${index + 1}`]]: true,
                  [styles.cardLight]: isLight,
                  [styles[`cardLight${index + 1}`]]: isLight,
                })}
                style={cardBg ? { backgroundImage: `url(${cardBg})` } : {}}
              >
                <div className={styles.cardContent} style={contentBg ? { backgroundImage: `url(${contentBg})` } : {}}>
                  <h3>{title}</h3>
                  <p>{desc}</p>

                  {isShowIcon && coinCount ? (
                    <div
                      className={clsx({
                        [styles.coin]: true,
                        [styles.coinLight]: isLight,
                      })}
                    >
                      <div className={styles.coinNum}>
                        {coinCount}
                      </div>
                      <div className={styles.coinDesc}>{t('newhomepage.intro.tips2')}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </AnimatedContent>
          );
        })}
      </div>
    </section>
  );
};
