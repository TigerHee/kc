import useGrowth from '@/hooks/useGrowth';
import useTranslation from '@/hooks/useTranslation';
import { useCategoriesStore } from '@/store/categories';
import { useCoinDetailStore } from '@/store/coinDetail';
import { useCurrencyStore } from '@/store/currency';
import { NumberFormat, NumberFormat as PercentFormat, Table, useTheme } from '@kux/mui-next';
import { useLang } from 'gbiz-next/hooks';
import { useRouter } from 'kc-next/compat/router';
import { useMemo } from 'react';
import useScreen from 'src/hooks/useScreen';

import styles from './style.module.scss';
import useChar from '@/hooks/useChar';
import clsx from 'clsx';
import Title from '@/components/common/Title';


/**
 * 币种价格走势
 */
const PriceTrend = (props) => {
  const { _t, _tHTML } = useTranslation();
  const { currentLang, isRTL } = useLang();
  const router = useRouter();
  const coin = router?.query.coin;
  const { isSm } = useScreen();
  const { getFormattedPriceWithPrecision } = useGrowth();
  const char = useChar();
  const { bestSymbol, trendInfo } = useCoinDetailStore((state) => state);
  const fetchCoinSymbolDataLoading = false;

  const currency = useCurrencyStore((state) => state.currency);
  const coinDict = useCategoriesStore((state) => state.coinDict);
  const coinObj = coinDict[coin as string]; // 币种信息数据
  const code = coinObj?.currencyName || coin; // 币种简称
  const coinName = coinObj?.name || coin; // 币种全称

  const dataSource = useMemo(
    () => [
      {
        // 今日
        key: 'today',
        timePeriod: _t('v5WovDbc2WxVWMgQmX8hVY'),
        growthRate: trendInfo?.todayGrowthRate, // 涨幅
        growth: trendInfo?.todayGrowth, // 涨额
      },
      {
        // 7天
        key: 'sevenDays',
        timePeriod: _t('7rKq2HzNM8EvtUxzQKx5Gs'),
        growthRate: trendInfo?.sevenDaysGrowthRate, // 涨幅
        growth: trendInfo?.sevenDaysGrowth, // 涨额
      },
      {
        // 30天
        key: 'thirtyDays',
        timePeriod: _t('aD4LybjBVVGqBDFN5NQVpV'),
        growthRate: trendInfo?.thirtyDaysGrowthRate, // 涨幅
        growth: trendInfo?.thirtyDaysGrowth, // 涨额
      },
      {
        // 3个月
        key: 'threeMonths',
        timePeriod: _t('4kV8RVo3x2ka7FTHEw7fVK'),
        growthRate: trendInfo?.threeMonthsGrowthRate, // 涨幅
        growth: trendInfo?.threeMonthsGrowth, // 涨额
      },
    ],
    [_t, trendInfo?.sevenDaysGrowth, trendInfo?.sevenDaysGrowthRate, trendInfo?.thirtyDaysGrowth, trendInfo?.thirtyDaysGrowthRate, trendInfo?.threeMonthsGrowth, trendInfo?.threeMonthsGrowthRate, trendInfo?.todayGrowth, trendInfo?.todayGrowthRate],
  );

  const columns = useMemo(
    () => [
      {
        title: _t('vdXCk4yH9koH55GLcYkiyw'),
        dataIndex: 'timePeriod',
        width: 200,
        align: isRTL ? 'right' : 'left',
      },
      {
        title: _t('9RPxAZFUV1TcdvY4B18jbF'),
        dataIndex: 'growth',
        width: 200,
        align: 'center',
        render: (val) => {
          // <1且小于0.00000001 展示<0.00000001；没有数据就展示 '--'
          if (!val || Number.isNaN(Number(val))) {
            return '--';
          }
          const formattedPrice = getFormattedPriceWithPrecision({
            price: val,
            symbol: bestSymbol,
            needHandlePrice: true,
          });
          const showNormal = (typeof formattedPrice === 'string') && formattedPrice.indexOf('<') > -1;
          const renderFormattedPrice = showNormal ? (
            formattedPrice
          ) : (
            <NumberFormat>{formattedPrice}</NumberFormat>
          );
          return (
            <span
              className={clsx(styles.priceSpan, {
                [styles.greaterZero]: val > 0,
                [styles.lessZero]: val < 0,
              })}
            >
              <span style={{ unicodeBidi: 'plaintext' }}>
                <span>{char}</span>
                {renderFormattedPrice}
              </span>
            </span>
          );
        },
      },
      {
        title: _t('vcT1P77aLU794TZjp8FuGq'),
        dataIndex: 'growthRate',
        width: 200,
        align: isRTL ? 'left' : 'right',
        render: (val) => {
          if (!val || Number.isNaN(Number(val))) {
            return '--';
          }
          return (
            <span
              className={clsx(styles.priceSpan, {
                [styles.greaterZero]: val > 0,
                [styles.lessZero]: val < 0,
              })}
            >
              <PercentFormat
                options={{ style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                lang={currentLang}
              >
                {val}
              </PercentFormat>
            </span>
          );
        },
      },
    ],
    [_t, isRTL, getFormattedPriceWithPrecision, bestSymbol, char, currentLang],
  );

  return (
    <section className={styles.wrapper} data-inspector="inspector_kcs_price_trend" id={props.id}>
      <header>
        <Title
          data-ssg="price-trend-title"
          title={_tHTML('mbj7RcrxRegvXx8XxPgFrY', {
            coinName,
            code,
            char: char || currency,
          })}
        />
      </header>
      <Table
        size={isSm ? 'small' : 'basic'}
        rowClassName="trend_Row"
        dataSource={dataSource}
        columns={columns}
        loading={fetchCoinSymbolDataLoading}
      />
    </section>
  );
};

export default PriceTrend;