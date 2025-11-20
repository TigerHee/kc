/**
 * Owner: will.wang@kupotech.com
 */
import { NumberFormat } from '@kux/mui-next'
import { useCategoriesStore } from '@/store/categories';
import { useLang } from 'gbiz-next/hooks';
import { useMemo } from 'react';
import useScreen from 'src/hooks/useScreen';

import { addLangToPath } from 'src/tools/i18n';
import down from '@/assets/price/down.svg';
import up from '@/assets/price/up.svg';

import styles from './coinlist.module.scss';
import ChangeRate from '@/components/common/ChangeRate';
import { getSiteConfig } from 'kc-next/boot';
import { saveSpm2NextUrl } from '@/tools/ga';

const TOP_NUM = 10;

const CoinList = ({ list = [] }: {
  list: any[]
}) => {
  const { isH5 } = useScreen();
  const { currentLang } = useLang();
  const categories = useCategoriesStore((state) => state.coinDict);

  const showList = useMemo(() => {
    return list.slice(0, TOP_NUM);
  }, [list]);

  return (
    <ul>
      {showList.map((item) => {
        const coinObj = categories ? categories[item.name] : {};
        const handleClick = (e) => {
          e.preventDefault();
          if (item.name) {
            if (typeof window !== 'undefined') {
              const priceUrl = addLangToPath(`${getSiteConfig().KUCOIN_HOST}/price/${item.name}`)
              // 进入price详情界面存储pre_spm_id;
              saveSpm2NextUrl(priceUrl, "kcWeb.B5CoinPriceDetails.leaderboard.coins");
              const newWindow = window.open(
                priceUrl,
                isH5 ? '_self' : '_blank',
              );
              newWindow && (newWindow.opener = null);
            }
          }
        };
        return (
          <li key={item.name}>
            <a className={styles.itemWrapper}
              key={item.name}
              onClick={handleClick}
              href={addLangToPath(`/price/${item.name}`)}
            >
              <img className={styles.coinIcon} src={item.iconUrl} alt="coin logo" loading="lazy" />
              <div className={styles.coinData}>
                <div className={styles.dataRow}>
                  <span className={styles.strong}>{item.name}</span>
                  <span className={styles.strong}>
                    {item.price && (
                      <NumberFormat
                        options={{
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 8,
                        }}
                        lang={currentLang}
                      >
                        {item.price}
                      </NumberFormat>
                    )}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.normal}>{coinObj?.name || item.name}</span>
                  <div className={styles.rateWrapper}>
                    <ChangeRate
                      className={Number(item.changeRate) === 0 ? styles.rateNormal : ''}
                      value={item.changeRate}
                    />
                    <img src={item.changeRate >= 0 ? up : down} alt="icon" />
                  </div>
                </div>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default CoinList;