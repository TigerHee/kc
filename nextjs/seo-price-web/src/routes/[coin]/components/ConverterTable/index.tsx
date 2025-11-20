/**
 * Owner: ella.wang@kupotech.com
 */
import { ICArrowRightOutlined } from "@kux/icons";
import { useCallback, useEffect, useMemo } from "react";
import styles from "./style.module.scss";
import Title from "@/components/common/Title";
import useTranslation from "@/hooks/useTranslation";
import { useRouter } from "kc-next/compat/router";
import { useCurrencyStore } from "@/store/currency";
import { usePriceStore } from "@/store/price";
import { useCoinDetailStore } from "@/store/coinDetail";
import { useCategoriesStore } from "@/store/categories";
import { currencyMap } from "@/config/base";
import multiply from "@/tools/math/multiply";
import { addLangToPath } from "@/tools/i18n";
import { getUsdtRate } from "@/services/price";
import formatNumber from "@/tools/formatNumber";
import { bootConfig } from "kc-next/boot";
import { getTenantConfig } from "@/config/tenant";
import { divide } from "@/tools/math";

const ConverterTable = () => {
  const { _t } = useTranslation();
  const router = useRouter();
  const coin = router?.query.coin as string;

  const shouldShowConverterTableLink = getTenantConfig().shouldShowConverterTableLink

  const faitList = useCurrencyStore((state) => state.currencyList);
  const usdtRate = usePriceStore((state) => state.usdtRate);
  const updatePriceProp = usePriceStore((state) => state.update);
  const prices = useCurrencyStore(s => s.prices);
  const currentCurrency = useCurrencyStore(s => s.currency);
  const bestSymbol = useCoinDetailStore((state) => state.bestSymbol);
  const latestPrice = useCoinDetailStore((state) => state.latestPrice);
  const thLatestPrice = useCoinDetailStore((state) => state.thLatestPrice);
  const tradePriceData = useCoinDetailStore((state) =>
    bestSymbol ? state.tradeData[bestSymbol] || null : null
  );
  
  const coinDict = useCategoriesStore((state) => state.coinDict);
  const precision = coin ? coinDict[coin as string]?.precision : 8;

  const price = useMemo(() => {
    const IS_TH = bootConfig._BRAND_SITE_ === 'TH';

    let coinPrice = tradePriceData?.price || latestPrice || 0;

    // 处理泰国站部分币种没有kline订阅价格的场景
    if (IS_TH) {
      if (thLatestPrice) {
        return thLatestPrice;
      }

      if (currentCurrency === 'USD') {
        const currentPrice = prices[coin.toUpperCase()];
        return currentPrice || coinPrice;
      }

      // 如果是非USD，先转成按照USD计价
      const usdRate = prices['USD'];
      coinPrice =  divide(coinPrice, usdRate)
      return coinPrice;
    }

    return coinPrice
  }, [coin, currentCurrency, latestPrice, prices, thLatestPrice, tradePriceData?.price]);

  const faitOptions = useMemo(() => {
    if (Array.isArray(faitList)) {
      const data: any[] = [];
      faitList.forEach((i) => {
        if (i !== "CNY") {
          data.push({
            label: i,
            value: i,
            symbol: currencyMap[i] ? `${currencyMap[i]}` : "",
            img: `https://assets2.staticimg.com/legal_coin/${i}.png`,
          });
        }
      });
      if (data.length > 10) {
        return data.slice(0, 10);
      }
      return data;
    }
    return [];
  }, [faitList]);

  useEffect(() => {
    if (faitList && faitList.length > 0) {
      getUsdtRate({
        base: bootConfig._BASE_CURRENCY_,
        targets: faitList?.filter((i) => i !== "CNY").join(","),
      })
        .then((res) => {
          updatePriceProp({ usdtRate: res.data });
        })
        .catch((err) => {
          //
        });
    }
  }, [faitList, updatePriceProp]);

  const convertToFait = useCallback(
    (fait, price, symbol) => {
      try {
        const res = multiply(+usdtRate[fait], +price);
        const decimal = Number(res) >= 1 ? 2 : precision || 2;

        if (Math.abs(+res) < 0.00000001 && +res !== 0) return "<0.00000001";

        const isMinus = Number(res) < 0;
        const resData = formatNumber(Math.abs(Number(res)), decimal);
        return `${isMinus ? "-" : ""}${symbol}${resData}`;
      } catch (error) {
        return "--";
      }
    },
    [usdtRate, precision]
  );

  const renderContent = useCallback(() => {
    if (Array.isArray(faitOptions) && faitOptions.length) {
      return faitOptions.map((item) => {
        const content = (
          <>
            <span>
              {_t("xkRzDesEqeGeLnL8fJoG6Y", { coin1: coin, coin2: item.value })}
            </span>
            <span>{convertToFait(item.value, price, item.symbol)}</span>
            {
              shouldShowConverterTableLink && <ICArrowRightOutlined />
            }
          </>
        )
        return (
          <li key={item.value}>
            {
              shouldShowConverterTableLink && (
                <a className={styles.listItem} href={addLangToPath(`/converter/${coin}-${item.value}`)}>
                  {content}
                </a>
              )
            }

            {
              !shouldShowConverterTableLink && (
                <span className={styles.listItem}>
                  {content}
                </span>
              )
            }
          </li>
        );
      });
    }
  }, [faitOptions, coin, _t, convertToFait, price, shouldShowConverterTableLink]);

  return (
    <section className={styles.wrapper}>
      <header>
        <Title
          title={_t("gMriHe7zWzk9EN6foF8P9c", {
            name: coin ? coinDict[coin as string]?.name || "" : "",
          })}
        />
      </header>
      <ul className={styles.list}>{renderContent()}</ul>
    </section>
  );
};

export default ConverterTable;
