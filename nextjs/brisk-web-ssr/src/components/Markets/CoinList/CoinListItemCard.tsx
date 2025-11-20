import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { trackClick } from 'gbiz-next/sensors';
import { useUserStore } from '@/store/user';
import { addLangToPath } from '@/tools/i18n';
import { manualTrack } from '@/tools/ga';
import type { CoinItem, CoinListItem, ComingCoinItem } from '@/types/coin';
import CoinIcon from '@/components/CommonComponents/CoinIcon';
import CoinCodeToName from '@/components/CommonComponents/CoinCodeToName';
import CoinCodeToFullName from '@/components/CommonComponents/CoinCodeToFullName';
import CoinCurrency from '@/components/CommonComponents/CoinCurrency';
import CountDown from './CountDown';
import { trackToLocationIdMap } from '../config';
import styles from './styles.module.scss';
import useTranslation from '@/hooks/useTranslation';
interface CoinListItemCardProps {
  item: CoinItem;
  index: number;
  track: string;
}

// 类型守卫函数
const isComingCoin = (item: CoinItem): item is ComingCoinItem => {
  return item.isComing === true;
};

const isCoinListItem = (item: CoinItem): item is CoinListItem => {
  return item.isComing === false;
};

export default ({ item, index, track }: CoinListItemCardProps) => {
  const isLogin = useUserStore(state => state.isLogin);
  const { t } = useTranslation();

  const { currencyCode, iconUrl, symbolCode } = item;
  const [baseCurrency, quoteCurrency] = symbolCode?.split('-') || [];

  const itemRef = useRef<HTMLAnchorElement>(null);
  const [canTrack, setCanTrack] = useState(true);

  const locationId = trackToLocationIdMap[track];

  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    if (itemRef.current && window.IntersectionObserver) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(e => {
            if (e.intersectionRatio > 0) {
              if (canTrack) {
                setCanTrack(false);
                manualTrack(['cyptoMarket', 'all'], {
                  currency: currencyCode,
                  sortPosition: index + 1,
                  norm_version: 1,
                  is_login: isLogin,
                  type: locationId,
                });
              }
            }
          });
        },
        { threshold: [0.1] }
      );

      observer.observe(itemRef.current);
    }
    return () => {
      observer?.disconnect?.();
    };
  }, [canTrack, currencyCode, index, isLogin, locationId]);

  return (
    <a
      ref={itemRef}
      href={addLangToPath(isComingCoin(item) ? `/trade/${symbolCode}` : `/price/${currencyCode}`)}
      className={styles.CoinListItem}
      target="_blank"
      onClick={() => {
        trackClick(['listEntry', '1'], {
          after_page_id: 'B5CoinPriceDetails',
          position: track,
          currency: currencyCode,
          sortPosition: index + 1,
          norm_version: 1,
          is_login: isLogin,
        });
      }}
    >
      <CoinIcon logoUrl={iconUrl} lazyImg={true} />

      <div className={styles.CoinListItemCenter}>
        <div className={styles.name}>
          <CoinCodeToName coin={currencyCode} />
        </div>
        <div className={styles.fullName}>
          <CoinCodeToFullName coin={currencyCode} disableFallback />
        </div>
      </div>

      {isComingCoin(item) ? (
        <div className={styles.countdownWrapper}>
          <CountDown seconds={item.tradeCountdown} />
          <span className={styles.launch}>{t('0d8e5635fad54000a2fc')}</span>
        </div>
      ) : (
        isCoinListItem(item) && (
          <div className={styles.CoinListItemRight}>
            <div className={styles.price}>
              <CoinCurrency
                baseCurrency={baseCurrency}
                coin={quoteCurrency}
                value={typeof item.price === 'number' ? item.price : Number(item.price) || null}
                needShowEquelFlag={false}
                hideLegalCurrency
                useLegalChars
                spaceAfterChar={false}
                defaultValue="--"
              />
            </div>
            <div
              className={clsx({
                [styles.rate]: true,
                [styles.rateUp]: Number(item.changeRate) > 0,
                [styles.rateDown]: Number(item.changeRate) < 0,
              })}
            >
              {app.formatNumber(
                typeof item.changeRate === 'string' ? parseFloat(item.changeRate) || 0 : item.changeRate || 0,
                {
                  style: 'percent',
                  maximumFractionDigits: 2,
                }
              )}
            </div>
          </div>
        )
      )}
    </a>
  );
};
