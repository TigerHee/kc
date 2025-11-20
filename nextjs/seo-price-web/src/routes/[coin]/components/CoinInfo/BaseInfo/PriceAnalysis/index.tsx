/**
 * Owner: will.wang@kupotech.com
 */
import { numberFormat } from '@kux/mui-next/utils';
import { cloneDeep, pickBy } from 'lodash-es';
import { useEffect, useMemo, useRef } from 'react';
import styles from './style.module.scss';
import { useLang } from 'gbiz-next/hooks';
import { useCoinDetailStore } from '@/store/coinDetail';
import { useRouter } from 'kc-next/compat/router';
import useMoneyAmountFormat from '@/hooks/useMoneyAmountFormat';
import useChar from '@/hooks/useChar';
import useNumberFormat from '@/hooks/useNumberFormat';
import { saTrackForBiz } from '@/tools/ga';
import Title from '@/components/common/Title';
import useTranslation from '@/hooks/useTranslation';
import usePriceFormat from '@/hooks/usePriceFormat';
import { useCurrencyStore } from '@/store/currency';
import { useCategoriesStore } from '@/store/categories';
import { addLangToPath } from '@/tools/i18n';

const formatData = (data, lang) => {
  try {
    if (data === 0 || +data === 0) return '0';
    if (!data || Number.isNaN(+data)) return '--';
    const pon = +data > 0 ? '+' : '';
    return pon + numberFormat({ number: +data * 100, options: { maximumFractionDigits: 2 }, lang });
  } catch (error) {
    return '--';
  }
};


const PriceAnalysis = () => {
  const { currentLang } = useLang();

  const router = useRouter();
  const coin = router?.query.coin || '';

  const { _t, _tHTML } = useTranslation();

  const { coinInfo, bestSymbol, latestPrice } = useCoinDetailStore(s => s);
  const liveData = useCoinDetailStore(
    (state) => bestSymbol ? state.tradeData[bestSymbol] : null,
  );
  const currency = useCurrencyStore((state) => state.currency);
  const coinDict = useCategoriesStore((state) => state.coinDict);

  const coinObj = coin ? coinDict[coin as string] || null : null;
  const code = coinObj?.currencyName || coin;
  const coinName = coinInfo.coinName;

  const {
    priceLiveData: priceData = {
      close: null,
      closeTime: null,
      high: null,
      highTime: null,
      low: null,
      lowTime: null,
      priceChangeRate24h: null,
      priceChangeRate7d: null,
      volume24h: null,
    },
  } = coinInfo;

  const { getMoneyWithRate, getLargeDigit } = useMoneyAmountFormat();
  const { priceNumberFormat } = useNumberFormat();
  const char = useChar(); // 汇率符号


  // 流通供应量
  const supply = getLargeDigit({
    value: !!Number(coinInfo.circulatingSupply) ? coinInfo.circulatingSupply : null,
  });
  // // 最大供应量
  // const maxSupply = getLargeDigit({
  //   value: !!Number(coinInfo.maxSupply) ? coinInfo.maxSupply : null,
  // });
  // 市值
  const marketValue = getMoneyWithRate({
    value: !!Number(coinInfo.marketCap) ? coinInfo.marketCap : null,
    needTransfer: false,
    lang: currentLang,
  });

  const priceLiveData = useMemo(() => {
    const clonedLiveData = cloneDeep(liveData) || {} as any;

    clonedLiveData.close = latestPrice || liveData?.price || 0;

    const priceLiveData = Object.assign(
      {},
      priceData,
      pickBy(clonedLiveData, (val) => !!val),
    );

    return priceLiveData;
  }, [latestPrice, liveData, priceData]);

  const volume24h = priceNumberFormat(priceLiveData.volume24h || liveData?.volume24h, bestSymbol); // 24小时交易额

  // 24小时交易额格式化
  const volume24hMoney = useMemo(() => {
    const money = getMoneyWithRate({
      value: !!Number(volume24h) ? volume24h : null,
      needTransfer: false,
      lang: currentLang,
    });

    return money;
  }, [currentLang, getMoneyWithRate, volume24h]);

  const LinkTo = () => {
    try {
      const urlPath = `/`;
      return addLangToPath(urlPath);
    } catch (error) {
      return '';
    }
  };

  const priceRef = useRef(null);
  const observerRef = useRef<IntersectionObserver>(null);
  let showFlag = false;

  useEffect(() => {
    let observer = observerRef.current;
    if (priceRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          (entries || []).map((e) => {
            if (e.intersectionRatio > 0 && !showFlag) {
              try {
                saTrackForBiz({}, ['currencyMoreInformation', '2'], {
                  position: 'Price Live Data',
                  pagecate: 'url',
                  url: LinkTo(),
                  yesOrNo: 0,
                });
                showFlag = true;
              } catch (e) {
                console.log('e', e);
              }
            }
          });
        },
        { threshold: [0.1] },
      );

      if (priceRef.current) observer.observe(priceRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [priceRef.current]);

  // 价格描述的I18nKey
  const priceTextI18nKey = useMemo(() => {
    // 周涨幅 < 0
    if (Number(priceLiveData?.priceChangeRate7d ?? 0) < 0) {
      return 'kT6hBr71jMQsKbGzA76MCu';
    }
    // 周涨幅 >= 0
    if (Number(priceLiveData?.priceChangeRate7d ?? 0) >= 0) {
      return '98TbMzgqCjCUxjqPJTfuYu';
    }
  }, [priceLiveData]);

  const showPrice = usePriceFormat({
    price: priceLiveData?.close,
    symbol: bestSymbol,
    hideChar: true,
    needRateConversion: true,
  });

  const showPricePara = !!bestSymbol && !!priceLiveData && !!priceTextI18nKey && !!showPrice;

  return (
    showPricePara && (
      <section>
        <header>
          <Title title={_t('cu93b9DWvPjsFBbmzsfewF', { coinName, coin: code })} />
        </header>
        <p className={styles.para}>
          {_tHTML(priceTextI18nKey, {
            coinName,
            currency,
            value1: char,
            coinCode: code,
            currencySym: char, // 汇率符号
            value2: !volume24hMoney || volume24hMoney === '0' ? '--' : volume24hMoney,
            price: showPrice,
            oneDayGrowthRate: formatData(priceLiveData?.priceChangeRate24h, currentLang),
            value4: formatData(priceLiveData?.priceChangeRate7d, currentLang),
            symbol: bestSymbol,
            num: coinInfo?.rank || '--',
            supply,
            value6: '--', // 市值24小时涨跌幅暂时没有
            marketPrice: marketValue,
          })}
        </p>
      </section>
    )
  );
};

export default PriceAnalysis;