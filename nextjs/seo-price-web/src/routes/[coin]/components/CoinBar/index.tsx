import { useTheme } from "@kux/mui-next";
import { useCallback, useMemo } from "react";
import {
  CANDLE_RESOLUTION_TYPES,
  KLINE_RESOLUTION_TYPES,
} from "@/config/kline";
import { trackClick } from "gbiz-next/sensors";
import KlineTypeSelector from "./KlineTypeSelector";
import ChangeRate from "@/components/common/ChangeRate";
import NumberFormatWithChar from "@/components/common/NumberFormatWithChar";
import styles from "./style.module.scss";
import useTranslation from "@/hooks/useTranslation";
import clsx from "clsx";
import { useCoinDetailStore } from "@/store/coinDetail";
import { KLineType, PriceLiveData } from "@/types/coinDetail";
import { bootConfig } from "kc-next/boot";
import { getRenderPrice } from "@/tools/price";

type CoinBarProps = {
  className?: string;
  bestSymbol: string;
  klineType: KLineType;
  setKlineType: (v: KLineType) => void;
  isUnsaleATemporary?: boolean;
};

const klineResolutionLabelMap: Record<string, [string, any]> = {
  "1H": ["kline.1hour", null],
  "24H": ["kline.1day", null],
  "1W": ["kline.1week", null],
  "1M": ["kline.M", { v: 1 }],
  "1Y": ["kline.Y", { v: 1 }],
  "3Y": ["kline.Y", { v: 3 }],
};

const itemLabelMap = {
  "1H": "coin.detail.line.type.1H",
  "1M": "coin.detail.line.type.1M",
  "1W": "coin.detail.line.type.1W",
  "1Y": "coin.detail.line.type.1Y",
  "24H": "coin.detail.line.type.24H",
  "3Y": "coin.detail.line.type.3Y",
};

const candleResolutionLabelMap: Record<string, [string]> = {
  m: ["5ZcqwUG474bW3L6ZttWjEp"],
  H: ["7GratCNRUr7FM3Ss64FoTt"],
  D: ["vJ4PsAteE4AVabdNsxebt6"],
  W: ["ouDQrkS5gcEySytvktM1Lg"],
};

const CoinBar = ({
  className,
  bestSymbol,
  klineType,
  setKlineType,
  isUnsaleATemporary,
}: CoinBarProps) => {
  const IS_TH_SITE = bootConfig._BRAND_SITE_ === 'TH'
  const { t } = useTranslation();

  const selectResolution = useCoinDetailStore(
    (state) => state.selectResolution
  );
  const kLineResolution = useCoinDetailStore((state) => state.kLineResolution);
  const thLatestPrice = useCoinDetailStore((state) => state.thLatestPrice);
  const coinInfo = useCoinDetailStore((state) => state.coinInfo);
  const latestPrice = useCoinDetailStore((state) => state.latestPrice);
  const tradeData = useCoinDetailStore(
    (state) => state.tradeData[bestSymbol] || null
  );
  const tradeDataPrice = useCoinDetailStore(
    (state) => state.tradeData[bestSymbol] || null
  ) as ((PriceLiveData & {
    price: string;
    priceChangeRate1h: string;
  }) | null);
  const openPrice = useCoinDetailStore((state) => state.openPrice);
  const updateCoinDetailStoreProp = useCoinDetailStore(
    (state) => state.updateProp
  );

  const theme = useTheme();

  // 针对临时币种和未开售币种先隐藏掉周期选择
  const finalTypes = useMemo(
    () => (isUnsaleATemporary ? [] : KLINE_RESOLUTION_TYPES),
    [isUnsaleATemporary]
  );
  // const finalTypes = KLINE_RESOLUTION_TYPES;

  const getLabel = useCallback(
    (str: string, kLineType: string) => {
      if (kLineType === "line") {
        return t(...klineResolutionLabelMap[str]);
      }

      const res = (str ?? "").split("");
      const unit = res.pop() || "m";
      const translationParams = candleResolutionLabelMap[unit];
      const label = `${res.join("")}${t(...translationParams)}`;

      return label;
    },
    [t]
  );

  const currentChangeRate = useMemo(() => {
    const [label] = klineType === "line" ? selectResolution : kLineResolution;

    switch (label) {
      case "1H":
        return tradeData?.priceChangeRate1h
          ? +tradeData?.priceChangeRate1h
          : null;
      case "1D":
      case "24H":
        return tradeData?.priceChangeRate24h
          ? +tradeData?.priceChangeRate24h
          : null;
      case "1W":
        return tradeData?.priceChangeRate7d
          ? +tradeData?.priceChangeRate7d
          : null;
      case "1M":
      case "1Y":
      case "3Y":
      case "1m":
      case "5m":
      case "15m":
      case "8H":
        return openPrice && latestPrice
          ? (latestPrice - openPrice) / openPrice
          : null;
      default:
        return null;
    }
  }, [
    kLineResolution,
    klineType,
    latestPrice,
    openPrice,
    selectResolution,
    tradeData?.priceChangeRate1h,
    tradeData?.priceChangeRate24h,
    tradeData?.priceChangeRate7d,
  ]);

  const renderPriceChange = useMemo(() => {
    const [orgLabel] =
      klineType === "line" ? selectResolution : kLineResolution;
    const label = getLabel(orgLabel, klineType);

    return currentChangeRate  === null ? (
      <div
        className={styles.priceChange}>
        <ChangeRate
          className={styles.extendChangeRate}
          value={0}
        />
        <span className={styles.changeRateLabel}>({label})</span>
      </div>
    ) : (
      <div
        className={clsx(styles.priceChange, {
          [styles.rateGreaterThanZero]: currentChangeRate > 0,
          [styles.rateLessThanZero]: currentChangeRate < 0,
        })}
      >
        <ChangeRate
          className={styles.extendChangeRate}
          value={currentChangeRate}
        />
        <span className={styles.changeRateLabel}>({label})</span>
      </div>
    );
  }, [
    currentChangeRate,
    getLabel,
    kLineResolution,
    klineType,
    selectResolution,
  ]);

  const currentPriceAndConversion = useMemo(() => {
    return getRenderPrice({
      latestPrice,
      thLatestPrice,
      tradeDataPrice: tradeDataPrice?.price,
      candleClosePrice: coinInfo.priceLiveData?.close
    });
  }, [coinInfo.priceLiveData?.close, latestPrice, tradeDataPrice?.price, thLatestPrice]);

  const renderPrice = useMemo(() => {

    return (
      <h2 className={styles.price}>
        {!currentPriceAndConversion.price ? (
          '--'
        ) : (
          <>
            <NumberFormatWithChar
              price={currentPriceAndConversion.price}
              symbol={bestSymbol}
              needRateConversion={currentPriceAndConversion.needRateConversion}
            />
            {renderPriceChange}
          </>
        )}
      </h2>
    );
  }, [bestSymbol, currentPriceAndConversion, renderPriceChange]);

  const renderLineSwitchList = useCallback(() => {
    return finalTypes.map((item) => (
      <span
        className={clsx(styles.switchItem, {
          [styles.active]: item[0] === selectResolution[0],
        })}
        key={item[0]}
        onClick={() => {
          //时间点击埋点
          try {
            trackClick(["Kline", "3"]);
          } catch (e) {
            console.log("e", e);
          }
          updateCoinDetailStoreProp({ selectResolution: item });
        }}
      >
        {t(itemLabelMap[item[0]])}
      </span>
    ));
  }, [finalTypes, selectResolution, t, updateCoinDetailStoreProp]);

  const renderCandleSwitchList = useCallback(() => {
    return CANDLE_RESOLUTION_TYPES.map((item) => {
      const label = getLabel(item[0], klineType);
      return (
        <span
          key={item[1]}
          className={clsx(styles.switchItem, {
            [styles.active]: item[0] === kLineResolution[0],
          })}
          onClick={() => {
            //时间点击埋点
            try {
              trackClick(["Kline", "3"]);
            } catch (e) {
              console.log("e", e);
            }
            updateCoinDetailStoreProp({ kLineResolution: item });
          }}
        >
          {label}
        </span>
      );
    });
  }, [getLabel, kLineResolution, klineType, updateCoinDetailStoreProp]);

  const renderSwitchList = useMemo(() => {
    if (isUnsaleATemporary) {
      return null;
    }
    return (
      <div className={styles.switchListWrapper}>
        <div className={styles.switchList} id="chart-switch-list">
          {klineType === "line"
            ? renderLineSwitchList()
            : renderCandleSwitchList()}
        </div>

        {!isUnsaleATemporary && (
          <KlineTypeSelector
            klineType={klineType}
            setKlineType={setKlineType}
          />
        )}
      </div>
    );
  }, [
    isUnsaleATemporary,
    klineType,
    renderCandleSwitchList,
    renderLineSwitchList,
    setKlineType,
  ]);

  return (
    <div className={clsx(styles.coinBarBox, className)}>
      {renderPrice}
      {bestSymbol ? renderSwitchList : null}
    </div>
  );
};
export default CoinBar;
