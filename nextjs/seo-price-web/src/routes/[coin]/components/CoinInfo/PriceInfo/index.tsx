/**
 * Owner: will.wang@kupotech.com
 */
import { NumberFormat as PercentFormat } from '@kux/mui-next';
import { isNil } from 'lodash-es';
// import MoneyAmountFormat from 'components/common/MoneyAmountFormat';
// import NumberFormatWithChar from 'routes/PricePage/Common/NumberFormatWithChar';
// import { useSelector } from 'src/hooks/useSelector';
// import Tip from 'src/routes/PricePage/Common/Tip';
// import { _t } from 'tools/i18n';
import SupplyFormat from './SupplyFormat';
import { useLang } from 'gbiz-next/hooks';
import useTranslation from '@/hooks/useTranslation';
import { useCoinDetailStore } from '@/store/coinDetail';
import { useCurrencyStore } from '@/store/currency';
import styles from './style.module.scss';
import { useCallback } from 'react';
import Tip from '@/components/common/Tip';
import NumberFormatWithChar from '@/components/common/NumberFormatWithChar';
import clsx from 'clsx';
import MoneyAmountFormat from '@/components/common/MoneyAmountFormat';

export default () => {

  const { _t } = useTranslation();
  const { currentLang } = useLang();
  const { coinInfo, bestSymbol } = useCoinDetailStore((state) => state);
  const explain = coinInfo.currencyExplain ?? { maxSupplyExplain: '' };
  const tradeData = useCoinDetailStore((state) => bestSymbol ? (state.tradeData[bestSymbol] || null) : null);
  const prices = useCurrencyStore((state) => state.prices);
  const isUnsaleATemporary = coinInfo.isUnsale || coinInfo.isTemporary;

  const NumberFormat = useCallback((price, symbol, idx = 0) => {
    try {
      if (!price) return price;
      const baseCoin = symbol.split('-')[idx];
      const baseCoinRate = prices ? prices[baseCoin] : null;
      if (baseCoinRate) {
        let target = Number(baseCoinRate) * price; // 多次高精度计算的bug
        return target;
      } else {
        return price;
      }
    } catch (error) {
      return price;
    }
  }, [prices]);

  const percentComp = useCallback((num: any) => {
    if (isNil(num) || num === '' || Number.isNaN(+num)) {
      return '--';
    }

    return (
      <PercentFormat
        options={{ style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
        lang={currentLang}
        isPositive={+num !== 0}
      >
        {num}
      </PercentFormat>
    );
  }, [currentLang]);

  // return null

  return (
    <div className={styles.priceInfo}>
      <dl className={styles.priceColumn}>
        <dt>
          <Tip
            text={_t('rXma9qMQG6LFhyZgBnNxG5')}
            spm={['currencyMoreInformation', '1']}
            sensorsData={{ position: 'ATH' }}
          >
            <span className={styles.priceLabel}>{_t('3q1A5iw6XX5TgtheHdHb8G')}</span>
          </Tip>
        </dt>
        <dd className={styles.priceSpan}>
          {(tradeData?.high || coinInfo.ath) && bestSymbol ? (
            <NumberFormatWithChar
              price={tradeData?.high || coinInfo.ath}
              symbol={bestSymbol}
              isUnsaleATemporary={isUnsaleATemporary}
            />
          ) : (
            '--'
          )}
        </dd>
      </dl>
      <dl className={styles.priceColumn}>
        <dt>
          <Tip
            text={_t('ddoSfStajTLkSGi6FyPcPt')}
            spm={['currencyMoreInformation', '1']}
            sensorsData={{ position: '1PC' }}
          >
            <span className={styles.priceLabel}>{_t('61t1CGDXDXnV35j5727sEf')}</span>
          </Tip>
        </dt>
        <dd className={clsx(styles.priceSpan, {
          [styles.greaterZero]: Number((tradeData?.priceChangeRate1h ?? 0)) > 0,
          [styles.lessZero]: Number((tradeData?.priceChangeRate1h ?? 0)) < 0,
        })}>
          {percentComp(tradeData?.priceChangeRate1h)}
        </dd>
      </dl>
      <dl className={styles.priceColumn}>
        <dt>
          <Tip
            text={_t('tkBxNa3WcsBa4DECHSsrMB')}
            spm={['currencyMoreInformation', '1']}
            sensorsData={{ position: '24PC' }}
          >
            <span className={styles.priceLabel}>{_t('coyEJ4nK7qdzWhqXaEaP9p')}</span>
          </Tip>
        </dt>
        <dd
          className={clsx(styles.priceSpan, {
            [styles.greaterZero]: Number((tradeData?.priceChangeRate24h ?? 0)) > 0,
            [styles.lessZero]: Number((tradeData?.priceChangeRate24h ?? 0)) < 0,
          })}
        >
          {percentComp(tradeData?.priceChangeRate24h)}
        </dd>
      </dl>
      <dl className={styles.priceColumn}>
        <dt>
          <Tip
            text={_t('sWLCFde5BTPp5upfN5TV72')}
            spm={['currencyMoreInformation', '1']}
            sensorsData={{ position: '7DPC' }}
          >
            <span className={styles.priceLabel}>{_t('pDq2xvo1BYh8LxERuDjc4S')}</span>
          </Tip>
        </dt>
        <dd 
          className={clsx(styles.priceSpan, {
            [styles.greaterZero]: Number((tradeData?.priceChangeRate7d ?? 0)) > 0,
            [styles.lessZero]: Number((tradeData?.priceChangeRate7d ?? 0)) < 0,
          })}
        >
          {percentComp(tradeData?.priceChangeRate7d)}
        </dd>
      </dl>
      <dl className={styles.priceColumn}>
        <dt>
          <Tip
            text={_t('47wi7yFXguZYNqmAsedMTH')}
            spm={['currencyMoreInformation', '1']}
            sensorsData={{ position: 'Market Cap' }}
          >
            <span className={styles.priceLabel}>{_t('uwDgDwhjriM9cyH84bsi4S')}</span>
          </Tip>
        </dt>
        <dd className={styles.priceSpan}>
          <MoneyAmountFormat
            value={!!Number(coinInfo.marketCap) ? coinInfo.marketCap : null}
            needTransfer={false}
          />
        </dd>
      </dl>
      <dl className={styles.priceColumn}>
        <dt>
          <Tip
            text={_t('4ba1p6vkDBonVxnSaVxzGU')}
            spm={['currencyMoreInformation', '1']}
            sensorsData={{ position: '24Trading Volume' }}
          >
            <span className={styles.priceLabel}>{_t('bEEH8CX2HBdZPGK2QojBzS')}</span>
          </Tip>
        </dt>
        <dd>
          <MoneyAmountFormat
            value={NumberFormat(tradeData?.volume24h, bestSymbol)}
            needTransfer={false}
          />
        </dd>
      </dl>
      <dl className={styles.priceColumn}>
        <dt>
          <Tip
            text={_t('iTTfSMVowtaYmEaRDuWwGm')}
            spm={['currencyMoreInformation', '1']}
            sensorsData={{ position: 'Circulation Supply' }}
          >
            <span className={styles.priceLabel}>{_t('urtaDeFLyLjcciJB7hGx3S')}</span>
          </Tip>
        </dt>
        <dd className={styles.priceSpan}>
          <SupplyFormat value={coinInfo.circulatingSupply} />
        </dd>
      </dl>
      <dl className={styles.priceColumn}>
        <dt>
          <Tip
            text={explain.maxSupplyExplain}
            spm={['currencyMoreInformation', '1']}
            sensorsData={{ position: 'Max Supply' }}
          >
            <span className={styles.priceLabel}>{_t('scMcJ4Ab2xC4NJbbByuze7')}</span>
          </Tip>
        </dt>
        <dd className={styles.priceSpan}>
          <SupplyFormat value={coinInfo.maxSupply} />
        </dd>
      </dl>
    </div>
  );
};