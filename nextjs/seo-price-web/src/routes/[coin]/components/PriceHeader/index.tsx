/**
 * Owner: will.wang@kupotech.com
 */
import { Select } from "@kux/mui-next";
import { useLang } from "gbiz-next/hooks";
import { useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { currencyMap } from "@/config/base";
import { trackClick } from "gbiz-next/sensors";
import CoinIconAndName, {
} from "@/routes/[coin]/components/PriceHeader/CoinIconAndName";
import TemporaryCoinAlertMessage from "@/routes/[coin]/components/PriceHeader/TemporaryCoinAlertMessage";
import CoinBar from "@/routes/[coin]/components/CoinBar";
import { useCurrencyStore } from "@/store/currency";
import { useCategoriesStore } from "@/store/categories";
import { useCoinDetailStore } from "@/store/coinDetail";
import { KLineType } from "@/types/coinDetail";

type PriceHeaderProps = {
  coin: string;
  klineType: KLineType;
  setKlineType: (v: KLineType) => void;
  isTemporary: boolean;
  isUnsaleATemporary: boolean;
};

const UnicodeRTL = ({ children, isRTL }) => {
  if (!isRTL) {
    return children;
  }
  return <>&#x202E;{children}&#x202C;</>;
};

export default function PriceHeader(props: PriceHeaderProps) {
  const { coin, klineType, setKlineType, isTemporary, isUnsaleATemporary } =
    props;
  const bestSymbol = useCoinDetailStore((s) => s.bestSymbol);
  const coinName = useCoinDetailStore((s) => s.coinInfo.coinName);
  const iconUrl = useCoinDetailStore((s) => s.coinInfo.logo);
  const currencyList = useCurrencyStore((state) => state.currencyList);
  const currency = useCurrencyStore((state) => state.currency);
  const updateCurrencyProp = useCurrencyStore((state) => state.updateProp);
  const { isRTL } = useLang();
  const coinDict = useCategoriesStore((state) => state.coinDict);
  const coinObj = coin ? coinDict[coin] ?? null : null;
  const pullPrices = useCurrencyStore((s) => s.pullPrices);

  // const [showDom, setShowDom] = useState(false);

  // TODO 法币埋点
  //法币切换曝光埋点
  // useEffect(() => {
  //   if (currency) {
  //     try {
  //       saTrackForBiz({}, ['Kline', '1'], {
  //         symbol: currency,
  //       });
  //     } catch (e) {
  //       console.log('e', e);
  //     }
  //     try {
  //       saTrackForBiz({}, ['Kline', '2']);
  //     } catch (e) {
  //       console.log('e', e);
  //     }
  //   }
  // }, [currency]);

  // const handleClick = useCallback(() => {
  //   setShowDom(!showDom);
  //   if (!showDom) {
  //     try {
  //       saTrackForBiz({}, ['Kline', '2'], {});
  //     } catch (e) {
  //       console.log('e', e);
  //     }
  //   }
  // }, [showDom]);

  // const selectBox = document.getElementsByClassName('select');

  // useEffect(() => {
  //   if (selectBox[0]) {
  //     selectBox[0].addEventListener('click', handleClick, false);
  //   }
  //   return () => {
  //     if (selectBox[0]) {
  //       selectBox[0].removeEventListener('click', handleClick, false);
  //     }
  //   };
  // }, [handleClick, selectBox, showDom]);


  const options = useMemo(() => {
    return currencyList
      .filter((i) => i !== "CNY")
      .map((i) => ({
        label: <UnicodeRTL isRTL={isRTL}>{`${i}${currencyMap[i] ? `(${currencyMap[i]})` : ''}`}</UnicodeRTL>,
        value: i,
      }));
  }, [currencyList, isRTL]);

  return (
    <>
      <div className={styles.coinBaseInfoBox}>
        <CoinIconAndName
          coin={coin}
          currencyName={coinObj?.currencyName}
          iconUrl={iconUrl ?? coinObj?.iconUrl}
          name={coinName ?? coinObj?.name}
        />
        <div className={styles.selectWrapper}>
          <Select
            size="small"
            allowSearch
            fullWidth
            matchWidth
            searchIcon={false}
            value={currency}
            onChange={(currency) => {
              try {
                trackClick(["Kline", "2"], {});
              } catch (e) {
                console.log("e", e);
              }

              updateCurrencyProp({ currency });
              pullPrices(currency);
            }}
            options={options}
            filterOption={(searchStr, option) =>
              option.value.toLowerCase().indexOf(searchStr.toLowerCase()) >= 0
            }
          />
        </div>
      </div>

      {isTemporary && <TemporaryCoinAlertMessage />}

      <CoinBar
        isUnsaleATemporary={isUnsaleATemporary}
        bestSymbol={bestSymbol}
        klineType={klineType}
        setKlineType={setKlineType}
      />
    </>
  );
}
