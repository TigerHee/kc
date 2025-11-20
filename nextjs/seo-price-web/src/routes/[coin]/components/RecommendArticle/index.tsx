import { useTheme } from '@kux/mui-next';
import { dateTimeFormat } from '@kux/mui-next/utils';
import { useMemo } from 'react';
import { addLangToPath } from 'src/tools/i18n';
import article from '@/assets/price/article-icon-dark.svg';
import articleb from '@/assets/price/article-icon.svg';
import num1 from '@/assets/price/num1.svg';
import num2 from '@/assets/price/num2.svg';
import num3 from '@/assets/price/num3.svg';
import urnum1 from '@/assets/price/urnum1.svg';
import urnum2 from '@/assets/price/urnum2.svg';
import urnum3 from '@/assets/price/urnum3.svg';
import { useLang } from 'gbiz-next/hooks';
import { useCoinDetailStore } from '@/store/coinDetail';
import styles from './style.module.scss';
import useTranslation from '@/hooks/useTranslation';
import { getSiteConfig } from 'kc-next/boot';


const Normalimgs = [num1, num2, num3];
const UrNoimgs = [urnum1, urnum2, urnum3];

export default () => {
  const { KUCOIN_HOST } = getSiteConfig();
  const { isRTL, currentLang } = useLang();

  const { _t } = useTranslation();

  const articleRecommendList = useCoinDetailStore(
    (state) => state.coinInfo.articleRecommendList,
  );
  const coinName = useCoinDetailStore((state) => state.coinInfo.coinName || '');

  const Noimgs = useMemo(() => {
    return isRTL ? UrNoimgs : Normalimgs;
  }, [isRTL]);

  if (!articleRecommendList || !articleRecommendList.length) {
    return null;
  }

  return (
    <section className={styles.wrapper}>
      <header className={styles.titleBox}>
        <img className={styles.image} src={article} alt="image" />
        <span className={styles.title}>{_t('3f5cc1b513c74000a3f5', { tokenName: coinName })}</span>
      </header>
      <ul className={styles.hotList}>
        {articleRecommendList?.map((item, index) => {
          return (
            <li className={styles.hotItem} key={item.id || item.title}>
              {index < 3 ? <img className={styles.num} src={Noimgs[index]} alt="image" /> : <span className={styles.numText}>{index + 1}</span>}
              <p className={styles.mainContent}>
                <a className={styles.hotTitle}
                  title={item?.title}
                  href={addLangToPath(`${KUCOIN_HOST}${item.url}`)}
                  target="_blank"
                >
                  {item?.title}
                </a>
                {item.publicAt && (
                  <span className={styles.date}>
                    {dateTimeFormat({
                      lang: currentLang,
                      date: item.publicAt,
                      options: {
                        second: undefined,
                      },
                    })}
                  </span>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};