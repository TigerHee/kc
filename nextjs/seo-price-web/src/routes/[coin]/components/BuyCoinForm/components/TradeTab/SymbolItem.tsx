/**
 * Owner: kevyn.yu@kupotech.com
 */
import fp from 'lodash/fp';
import useScreen from 'src/hooks/useScreen';
import ChangeRate from 'src/components/common/ChangeRate';
import CoinCodeToName from 'src/components/common/CoinCodeToName';
import styles from './symbolitem.module.scss';
import { SYMBOL_TYPE } from '@/config/kline';
import formatUrlPathWithLangPrefix from '@/tools/formatUrlPathWithLangPrefix';
import useTranslation from '@/hooks/useTranslation';
import { useCoinDetailStore } from '@/store/coinDetail';
import { trackClick } from 'gbiz-next/sensors';
import NumberFormatWithChar from '@/components/common/NumberFormatWithChar';
import { getSiteConfig } from 'kc-next/boot';
import { useMemo } from 'react';
import { getTenantConfig } from '@/config/tenant';
import { getPerpFutureName } from '@/tools/helper';
import { getRenderPrice } from '@/tools/price';

const categoryI18nMap = {
  [SYMBOL_TYPE.SPOT]: 'coin.detail.symbols.table.category.spot',
  [SYMBOL_TYPE.MARGIN]: 'coin.detail.symbols.table.category.margin',
  [SYMBOL_TYPE.FUTURE]: 'coin.detail.symbols.table.category.future',
};

const SymbolItem = (props) => {
  const tradeLinkMap = useMemo(() => {
    return {
      [SYMBOL_TYPE.SPOT]: formatUrlPathWithLangPrefix('', getSiteConfig().TRADE_HOST),
      [SYMBOL_TYPE.MARGIN]: formatUrlPathWithLangPrefix('/margin', getSiteConfig().TRADE_HOST),
      [SYMBOL_TYPE.FUTURE]: formatUrlPathWithLangPrefix('/trade', getSiteConfig().KUMEX_HOST),
    };
  }, []);

  const getTradeLink = ({ category, symbol = '' }) => `${tradeLinkMap[category]}/${symbol}`;
  const { info } = props;
  const { _t } = useTranslation();
  const { tradeData, bestSymbol, latestPrice, thLatestPrice } = useCoinDetailStore((state) => state);
  const { symbol, price, baseCurrency, quoteCurrency, changeRate } = info[0] || {};
  const priceChangeRate24h = Number(tradeData[symbol]?.priceChangeRate24h);
  const currentPrice = Number(tradeData[symbol]?.price);
  const currency = baseCurrency === 'XBT' ? 'BTC' : baseCurrency;
  const proceedSymbol = [currency, quoteCurrency].join('-');
  const maxLeverages = Math.max(...fp.map(fp.get('maxLeverage'))(info));
  const categories = fp.map(fp.get('category'))(info);
  const { isH5 } = useScreen();
  const showPrice =
    symbol === bestSymbol ? latestPrice || currentPrice || price : currentPrice || price;

  
  const renderredPrice = getRenderPrice({ latestPrice, thLatestPrice, tradeDataPrice: currentPrice, candleClosePrice: '' })
  // 是否隐藏合约和杠杆，只展示现货
  const shoudHideFuturesAndMargin = getTenantConfig().shoudHideFuturesAndMargin;

  // categories交易对里面如果都是非现货，并且不支持现货，就隐藏
  const shoudHideItem = useMemo(() => {
    const shouldHide = shoudHideFuturesAndMargin && !categories.includes(SYMBOL_TYPE.SPOT);
    return shouldHide;
  }, [categories, shoudHideFuturesAndMargin]);

  if (shoudHideItem) return null;

  const isFuture = categories.includes(SYMBOL_TYPE.FUTURE);

  return (
    <li className={styles.wrapper}>
      <div className={styles.row}>
        <div className={styles.symbolInfo}>
          <span className={styles.symbolText}>
            {!isFuture && (
              <>
                <CoinCodeToName coin={currency} />
                <span>{'/'}</span>
                <CoinCodeToName coin={quoteCurrency} />
              </>
            )}
            {isFuture && getPerpFutureName({ symbol: currency, currency: quoteCurrency, tI18n: _t })}
          </span>
          <span className={styles.leverage}>{maxLeverages}</span>
        </div>
        <div className={styles.symbolCategory}>
          {categories.map((category) => {
            // 部分只展示 SPOT, 隐藏合约和杠杆
            if (shoudHideFuturesAndMargin && category !== SYMBOL_TYPE.SPOT) return null;

            return (
              <a className={styles.extendLink} key={category}
                onClick={() => {
                  try {
                    trackClick(
                      [
                        'tradeLead',
                        category === 'SPOT' ? '1' : category === 'MARGIN' ? '2' : '3',
                      ],
                      {
                        symbol,
                        trade: 'tradebutton',
                      },
                    );
                  } catch (e) {
                    console.log('e', e);
                  }
                }}
                href={getTradeLink({ category, symbol })}
                target={isH5 ? '_self' : '_blank'}
                rel="noreferrer noopener"
              >
                {_t(categoryI18nMap[category])}
              </a>
            );
          })}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.priceInfo}>
          <span className={styles.price}>
            {renderredPrice.price && (
              <NumberFormatWithChar
                price={renderredPrice.price}
                symbol={proceedSymbol}
                needRateConversion={renderredPrice.needRateConversion}
              />
            )}
          </span>
          <ChangeRate value={priceChangeRate24h || changeRate} />
        </div>
      </div>
    </li>
  );
};

export default SymbolItem;