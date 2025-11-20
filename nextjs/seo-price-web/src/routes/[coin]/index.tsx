/**
 * Owner: will.wang@kupotech.com
 */
import { useResponsive } from "@kux/mui-next";
import Show from "@/components/common/Show";
import BreadCrumb from "@/routes/[coin]/components/BreadCrumb";
import styles from "./style.module.scss";
import PriceHeader from "@/routes/[coin]/components/PriceHeader";
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Advertisement from "@/routes/[coin]/components/Advertisement";
import useScreen from "@/hooks/useScreen";
import { useCoinDetailStore } from "@/store/coinDetail";
import Title from "@/components/common/Title";
import useTranslation from "@/hooks/useTranslation";
import { contentHandler } from "@/routes/[coin]/components/CoinInfo/Preview/helper";
import { trackClick } from "gbiz-next/sensors";
import clsx from "clsx";
import LearnAndEarnCard from "@/routes/[coin]/components/LearnAndEarnCard";
import {
  PriceKlineChart,
  PriceCandleChart,
} from "@/routes/[coin]/components/PriceKline";
import { useCategoriesStore } from "@/store/categories";
import { useCurrencyStore } from "@/store/currency";
import { KLineType } from "@/types/coinDetail";
import { useMount } from "ahooks";
import { useUserStore } from "@/store/user";
import { getTenantConfig } from "@/config/tenant";
import CoinBar from "@/routes/[coin]/components/CoinBar";
import { getPreSpmCode, saTrackForBiz } from "@/tools/ga";
import { addLangToPath } from "@/tools/i18n";
import Tab from "@/routes/[coin]/components/Tab";
import usePlatformSize from "@/hooks/usePlatformSize";

// ========== 动态加载的组件 START
// 影响LCP的都动态加载
// 有seo内容价值的或者首屏展示的，ssr为true，其他都为false
const BuyCoinForm = dynamic(() => import("@/routes/[coin]/components/BuyCoinForm"), { ssr: true });
const FloatComponents = dynamic(() => import("./components/FloatComponents/index"), { ssr: false });
const ConverterTable = dynamic(() => import("@/routes/[coin]/components/ConverterTable"), { ssr: false });
const UnsaleNote = dynamic(() => import('@/routes/[coin]/components/UnsaleOrTemporaryNote/index'), { ssr: false });
const RecommendArticle = dynamic(() => import("@/routes/[coin]/components/RecommendArticle"), { ssr: false });
const CoinRank = dynamic(() => import("@/routes/[coin]/components/CoinRank"), { ssr: false });
const ScaleMDialog = dynamic(() => import("@/components/KLineChart/components/ScaleMDialog"), { ssr: false });
const CoinInfo = dynamic(() => import("@/routes/[coin]/components/CoinInfo"), { ssr: true });
const About = dynamic(() => import("@/routes/[coin]/components/CoinInfo/About"), { ssr: true });
const PriceTrend = dynamic(() => import("@/routes/[coin]/components/CoinInfo/PriceTrend"), { ssr: false });
const Analysis = dynamic(() => import("@/routes/[coin]/components/Analysis"), { ssr: false });
const FAQ = dynamic(() => import("@/routes/[coin]/components/CoinInfo/FAQ"), { ssr: true });
const Recommend = dynamic(() => import("@/routes/[coin]/components/Recommend"), { ssr: true });
const RegisterCard = dynamic(() => import("@/routes/[coin]/components/RegisterCard"), { ssr: false });
// ========== 动态加载的组件 END

type CoinPageProps = { coin: string };

const DEFAULT_RESOLUTION = [];

const tabsConfig = {
  overview: {
    value: "overview",
    id: "price_overview",
  },
  about: {
    value: "about",
    id: "price_about",
  },
  analysis: {
    value: "analysis",
    id: "price_analysis",
  },
  faq: {
    value: "faq",
    id: "price_faq",
  },
  trade: {
    value: "trade",
    id: "price_trade",
  },
};



// useTradeData(); // symbols socket subscribe


const CoinPage = (props: CoinPageProps) => {
  const { coin } = props;
  const { _t } = useTranslation();
  const pullCoinDictData = useCategoriesStore((s) => s.pullCoinDictData);
  const pullPrices = useCurrencyStore((s) => s.pullPrices);
  const pullRates = useCurrencyStore((s) => s.pullRates);
  const getCurrentExpressSymbol = useCoinDetailStore(
    (s) => s.getCurrentExpressSymbol
  );

  /** 租户站配置 */
  const {
    showDetailTab,
    showDetailAd,
    showDetailConverterTable,
    showDetailCoinRank,
    showDetailLearnAndEarn,
    showDetailRecommendArticle,
    showDetailBuycoinForm,
    showDetailRecommendBuy,
    showDetailRegister,
  } = useMemo(() => {
    return getTenantConfig();
  }, []);

  const [noData, setNoData] = useState(false);
  const { isSm } = useScreen();
  const { isH5 } = usePlatformSize();

  const coinInfo = useCoinDetailStore((state) => state.coinInfo);
  const shouldHideChart = useCoinDetailStore((state) => state.hideChart);
  const getNotSalePriceData = useCoinDetailStore((state) => state.getNotSalePriceData);
  const isLogin = useUserStore((state) => state.isLogin);
  const { currencyIntroduction = [], isUnsale, isTemporary } = coinInfo;

  const responsive = useResponsive();
  const selectResolution = useCoinDetailStore(
    (state) => state.selectResolution
  );
  const kLineResolution = useCoinDetailStore(
    (state) => state.kLineResolution || DEFAULT_RESOLUTION
  );
  const coinDict = useCategoriesStore((state) => state.coinDict);
  const legalCurrency = useCurrencyStore((state) => state.currency);
  const bestSymbol = useCoinDetailStore((state) => state.bestSymbol);

  const source = useMemo(() => (responsive.md ? "WEB" : "H5"), [responsive.md]);

  const isUnSaleOrTemporary = useMemo(
    () => coinInfo.isUnsale || coinInfo.isTemporary,
    [coinInfo.isTemporary, coinInfo.isUnsale]
  );
  
  const initialKlineContainerHeight = useMemo(() => shouldHideChart ? 0 : (isH5 ? 336 : 340), [isH5, shouldHideChart]);

  const isUnsaleATemporary = useMemo(() => isUnsale || isTemporary, [isTemporary, isUnsale]);
  const initLineType = isUnsaleATemporary ? "line" : "candle";
  const [klineType, setKlineType] = useState<KLineType>(initLineType);

  const getDefault = useCallback(
    (coinName, coinCode, jumpSuffix) => {
      const question1 = _t("9k6VhouPNaqmmXPUpDYeyK", { coinName, coinCode });
      const answer1 = _t("qKvkfmx1TQgkiVN87n7Cdf", {
        coinName,
        coinCode,
        url: addLangToPath(
          `/how-to-buy/${(jumpSuffix || "").toLowerCase().replace(/\s/g, "-")}`
        ),
      });
      return {
        question: question1,
        answer: [{ type: "RICHTEXT", subText: answer1 }],
        clickEvent: (e) => {
          if (e.target.tagName === "A") {
            trackClick(["HowToBuy", "1"], { symbol: coinCode });
          }
        },
      };
    },
    [_t]
  );

  const contentArr = useMemo(() => {
    if (coinInfo) {
      const defaultData = getDefault(
        coinInfo?.coinName,
        coinInfo?.code,
        coinInfo?.jumpSuffix
      );
      const data = contentHandler(currencyIntroduction) || [];
      return [defaultData, ...data];
    }
    return [];
  }, [coinInfo, getDefault, currencyIntroduction]);

  // 右侧根据模块租户站的配置，展示/隐藏
  const RightContentView = useMemo(() => {
    return (
      <>
        <Show when={showDetailBuycoinForm && !isTemporary}>
          <BuyCoinForm />
        </Show>

        <Show when={showDetailLearnAndEarn}>
          <LearnAndEarnCard />
        </Show>

        <Show
          when={showDetailRegister && (isUnsale || isTemporary) && !isLogin}
        >
          <RegisterCard />
        </Show>

        <Show when={showDetailRecommendBuy && !isTemporary}>
          <Recommend />
        </Show>

        <Show when={showDetailCoinRank}>
          <CoinRank />
        </Show>

        <Show when={showDetailRecommendArticle}>
          <RecommendArticle />
        </Show>
        {/*
         */}
      </>
    );
  }, [
    isLogin,
    isTemporary,
    isUnsale,
    showDetailBuycoinForm,
    showDetailCoinRank,
    showDetailLearnAndEarn,
    showDetailRecommendArticle,
    showDetailRecommendBuy,
    showDetailRegister,
  ]);

  const renderKlineView = useCallback((isDialog = false) => {
    return isUnsaleATemporary || klineType === "line" ? (
      <PriceKlineChart
        _wsInstanceId={0}
        coin={coin}
        symbol={bestSymbol}
        resolutionLabel={selectResolution[0]}
        resolution={selectResolution[1]}
        timeRange={selectResolution[2]}
        limitPoints={selectResolution[3]}
        isUnsaleATemporary={isUnsaleATemporary}
        noData={noData}
        setNoData={setNoData}
        isDialog={isDialog}
        {...(isDialog
          ? {
              domId: "kc_s_k_line_m_dialog",
              hideScale: true,
              height: 506,
            }
          : { height: 280 })}
      />
    ) : (
      <PriceCandleChart
        coin={coin}
        _wsInstanceId={2}
        symbol={bestSymbol}
        resolution={kLineResolution[1]}
        // isUnsaleATemporary={isUnsaleATemporary}
        isDialog={isDialog}
        {...(isDialog
          ? {
              domId: "kc_s_k_candle_m_dialog",
              hideScale: true,
              height: 506,
            }
          : { height: 280 })}
      />
    )
  }, [bestSymbol, coin, isUnsaleATemporary, kLineResolution, klineType, noData, selectResolution])

  // 获取临时币种 & 未开售币种价格信息
  useEffect(() => {
    if (isUnSaleOrTemporary && coin) {
      getNotSalePriceData({ symbol: coin })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coin, isUnSaleOrTemporary]);

  // 客户端执行的逻辑，请求一些比较重的接口数据
  useMount(() => {
    pullCoinDictData();
    pullPrices();
    pullRates();
    getCurrentExpressSymbol(coin, legalCurrency);
    // 埋点
    saTrackForBiz({ saType: 'expose' }, ['page', '1'], { currency: coin, pre_spm_id: getPreSpmCode() });
  });

  return (
    <div className={styles.pricePageBox} data-inspector="price-detail-page">
      <div className={styles.priceBox}>
        <div className={styles.navigationBox}>
          <BreadCrumb coin={coin} />
        </div>

        <div className={styles.contentWrapper} id="price_content_wrapper">
          {/* 左侧内容 */}
          <div className={styles.conLeft}>
            <section
              data-inspector="inspector_kcs_kline"
              className={styles.klineBox}
            >
              <PriceHeader
                coin={coin}
                klineType={klineType}
                setKlineType={setKlineType}
                isTemporary={isTemporary}
                isUnsaleATemporary={isUnsaleATemporary}
              />
              <div style={{ position: 'relative', minHeight: initialKlineContainerHeight,  width: '100%' }}>
                {renderKlineView()}
              </div>

              <ScaleMDialog>
                <>
                  <CoinBar
                    className={styles.coinBarInDialog}
                    isUnsaleATemporary={isUnsaleATemporary}
                    bestSymbol={bestSymbol}
                    klineType={klineType}
                    setKlineType={setKlineType}
                  />
                  {renderKlineView(true)}
                </>
              </ScaleMDialog>

              {isUnSaleOrTemporary && <UnsaleNote />}
            </section>

            <Show when={showDetailTab}>
              <Show when={showDetailAd}>
                <Advertisement />
              </Show>

              <Tab />

              <CoinInfo id={tabsConfig.overview.id} />

              <section
                className={clsx(styles.cont, {
                  [styles.hide]: !contentArr.length,
                })}
                id={tabsConfig.about.id}
              >
                <header>
                  <Title
                    title={_t("sMGAYYLkfBwfrcGdMQzLkx", { coinName: coin })}
                    data-ssg="base-info-title"
                  />
                </header>
                <About
                  data={contentArr}
                  data-ssg="base-info-content"
                  data-inspector="base-info-content"
                />
              </section>

              <Show when={!(isUnsale || isTemporary)}>
                <span id={tabsConfig.analysis.id}>
                  <PriceTrend />
                  <Analysis />
                </span>
              </Show>

              <Show when={showDetailConverterTable}>
                <ConverterTable />
              </Show>

              <FAQ id={tabsConfig.faq.id} />
            </Show>

            {/* 新增 trade tab,在 h5 中把右侧模块移入到此 tab 中 */}
            <Show when={isSm}>
              <div className={styles.tradeWrapper} id={tabsConfig.trade.id}>
                {RightContentView}
              </div>
            </Show>
          </div>

          {/* 右侧内容 */}
          <Show when={!isSm}>
            <aside className={styles.conRight}>{RightContentView}</aside>
          </Show>
        </div>
      </div>
      <FloatComponents />
    </div>
  );
};

export default CoinPage;
