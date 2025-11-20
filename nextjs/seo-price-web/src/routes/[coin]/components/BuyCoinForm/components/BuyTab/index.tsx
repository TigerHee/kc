/**
 * Owner: will.wang@kupotech.com
 */
import { ICArrowRight2Outlined } from '@kux/icons';
import { Button } from '@kux/mui-next';
import { useEffect, useMemo, useRef, useState } from 'react';
import useScreen from 'src/hooks/useScreen';
import InputBox from './InputBox';
import styles from './style.module.scss';
import { useRouter } from 'kc-next/compat/router';
import { useCategoriesStore } from '@/store/categories';
import { useCurrencyStore } from '@/store/currency';
import { useCoinDetailStore } from '@/store/coinDetail';
import { addLangToPath } from '@/tools/i18n';
import { jsonToUrlParams } from '@/tools/helper';
import NumberFormatWithChar from '@/components/common/NumberFormatWithChar';
import { saTrackForBiz } from '@/tools/ga';
import clsx from 'clsx';
import useTranslation from '@/hooks/useTranslation';
import { BASE_COIN } from '@/config/kline';
import { getSiteConfig } from 'kc-next/boot';


const BuyCoinForm = ({ visible }) => {
  const { KUCOIN_HOST } = getSiteConfig();
  const router = useRouter();
  const coin = router?.query.coin;
  const { _t } = useTranslation();

  const [value, setValue] = useState('');
  const coinDict = useCategoriesStore((state) => state.coinDict);
  const coinObj =  coin ? (coinDict[coin as string] || null) : null;

  const currency = useCurrencyStore((state) => state.currency);
  const { expressSymbol, latestPrice, bestSymbol } = useCoinDetailStore((state) => state);
  const { isH5 } = useScreen();

  const LinkTo = () => {
    const params = Object.assign(
      {
        target: coin,
      },
      expressSymbol.split('-')[1] && {
        base: currency,
      },
      value && {
        cryptoAmount: value,
        quoteType: 'CRYPTO',
      },
    );
    const urlPath = `${KUCOIN_HOST}/express?${jsonToUrlParams(params)}`;
    return addLangToPath(urlPath);
  };

  let showTitle = false,
    showBtn = false;
  const observerRef = useRef<IntersectionObserver>(null);
  const titleRef = useRef(null);
  const btnRef = useRef(null);

  const lastPriceView = useMemo(() => {
    const priceCalculation = (latestPrice ?? 0) * Number(value ?? 0);
    if (priceCalculation && bestSymbol) {
      return (
        <span>
          <NumberFormatWithChar
            price={priceCalculation}
            symbol={bestSymbol}
          />
          {` ${currency}`}
        </span>
      )
    }

    return (
      <span>
        {`-- ${currency}`}
      </span>
    )
  }, [bestSymbol, currency, latestPrice, value])


  useEffect(() => {
    let observer = observerRef.current;

    if (titleRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          (entries || []).map((e) => {
            if (e.intersectionRatio > 0 && !showTitle) {
              try {
                saTrackForBiz({}, ['buyCurrency', '1']);
                saTrackForBiz({}, ['buyCurrency', '2']);
                showTitle = true;
              } catch (e) {
                console.log('e', e);
              }
            }
          });
        },
        { threshold: [0.1] },
      );

      if (titleRef.current) observer.observe(titleRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [titleRef.current]);

  useEffect(() => {
    let observer = observerRef.current;
    if (btnRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.map((e) => {
            if (e.intersectionRatio > 0 && !showBtn) {
              try {
                saTrackForBiz({}, ['buyCurrency', '3']);

                showBtn = true;
              } catch (e) {
                console.log('e', e);
              }
            }
          });
        },
        { threshold: [0.1] },
      );

      if (btnRef.current) observer.observe(btnRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [btnRef.current]);

  return (
    <div
      className={clsx(styles.buyCoinFormBox, {
        [styles.visible]: visible,
      })} 
      ref={titleRef}
    >
      <InputBox coin={coinObj?.currencyName || coin} value={value} setValue={setValue} />
      <div className={styles.total}>
        <div className={styles.span}>{_t('eXsgcWxgHrDXQNgdco7RUh')}</div>
        {lastPriceView}
      </div>

      {(bestSymbol || BASE_COIN.includes(((coin || '') as string).toUpperCase()) || expressSymbol) && (
        <div ref={btnRef}>
          <Button
            size="large"
            fullWidth
            onClick={() => {
              window.open(LinkTo());
            }}
          >
            {_t('bd533bb895664000a7e8', { coinName: coinObj?.currencyName || coin })}
          </Button>
        </div>
      )}

      <Button
        variant="text"
        type="brandGreen"
        fullWidth
        onClick={() => {
          if (typeof window !== 'undefined') {
            const newWindow = window.open(addLangToPath('/express'), isH5 ? '_self' : '_blank');
            newWindow && (newWindow.opener = null);
          }
        }}
        endIcon={<ICArrowRight2Outlined />}
      >
        {_t('56df1e5631454000ae5d')}
      </Button>
    </div>
  );
};

export default BuyCoinForm;