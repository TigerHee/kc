/**
 * Owner: june.lee@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { css, dateTimeFormat, Empty, Global, styled, Tab, Tabs } from '@kux/mui';
import { useTheme } from '@kux/mui/hooks';
import Axis from 'bizcharts/lib/components/Axis';
import Chart from 'bizcharts/lib/components/Chart';
import Geom from 'bizcharts/lib/components/Geom';
import Guide from 'bizcharts/lib/components/Guide';
import Legend from 'bizcharts/lib/components/Legend';
import Tooltip from 'bizcharts/lib/components/Tooltip';
import { memo, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { themeColorText } from 'src/utils/themeSelector';
import { _t } from 'tools/i18n';

const PriceChartRoot = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  .chart-head {
    display: flex;
    align-items: center;
    align-self: stretch;
    justify-content: space-between;

    .chart-name {
      color: ${themeColorText};
      font-weight: 600;
      font-size: 16px;
      line-height: 130%; /* 20.8px */
    }
  }
  .chart-content {
    width: 100%;
    height: 288px;

    .emptyWrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
  }
`;

const TransactionChart = () => {
  const shortName = useSelector((state) => state.aptp.deliveryCurrencyInfo?.shortName);
  const offerCurrency = useSelector((state) => state.aptp.deliveryCurrencyInfo?.offerCurrency);
  const _dataSource = useSelector((state) => state.aptp.priceChartData);
  const { currentLang: lang } = useLocale();
  const dataSource = useMemo(
    () =>
      _dataSource?.map((x) => ({
        ...x,
        title: dateTimeFormat({
          lang,
          date: x.datetime,
          options: {
            second: undefined,
          },
        }),
      })) ?? [],
    [_dataSource, lang],
  );
  const [range, setRange] = useState('1d');
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if (range && shortName) {
      dispatch({
        type: 'aptp/pullPriceChart',
        payload: {
          candleType: range,
          currency: shortName,
          type: 'priceChart',
        },
      });
    }
  }, [range, shortName, dispatch]);

  const datetimeAxisConfig = {
    tickLine: null,
    line: null,
    label: {
      autoRotate: false,
      textStyle: {
        fill: theme.colors.text40,
        fontSize: '12', // 文本大小
      },
    },
  };
  const avgPriceAxisConfig = {
    // title: {
    //   offsetY: 20, // 设置标题 title 距离坐标轴线的距离
    //   textStyle: {
    //     fontSize: '12',
    //     textAlign: 'center',
    //     fill: theme.colors.text40,
    //     rotate: 0,
    //   }, // 坐标轴文本属性配置
    //   position: 'end', // 标题的位置，**新增**
    // },
    tickLine: null,
    line: null,
    label: {
      autoRotate: false,
      textStyle: {
        fill: theme.colors.text40,
        fontSize: '12', // 文本大小
      },
    },
  };

  const getName = (val) => {
    const map = {
      avgPrice: _t('bdf22c31e9a04000a613'),
      amount: _t('67173f5d135b4000a94f'),
    };
    return map[val] || ''; // val 为每个图例项的文本值
  };

  const maxLabelLen = useMemo(() => {
    let res = 0;
    for (const p of dataSource || []) {
      const { avgPrice = '0' } = p;
      const labelLen = avgPrice?.split('.')?.[0].length ?? 0;
      if (labelLen > res) {
        res = labelLen;
      }
    }
    return res;
  }, [dataSource]);

  const chartPadding = useMemo(
    () => ({
      top: 30,
      right: 10,
      bottom: 50,
      left: maxLabelLen > 4 ? maxLabelLen * 10 : 40,
    }),
    [maxLabelLen],
  );

  const itemTpl =
    '<li class="trx-li" data-index={index}>\n      <svg viewBox="0 0 ' +
    5 +
    ' ' +
    5 +
    '" class="' +
    'g2-tooltip-marker' +
    '"></svg>\n      {name}<span class="' +
    'g2-tooltip-value' +
    '">{value}</span></li>';

  return (
    <PriceChartRoot>
      <div className="chart-head">
        <div className="chart-name">{_t('243797d1e3784000a4ab')}</div>
        <div className="chart-range">
          <Tabs
            value={range}
            onChange={(e, newVal) => {
              setRange(newVal);
            }}
            variant="slider"
            size="medium"
          >
            <Tab label="1D" value="1d" />
            <Tab label="7D" value="7d" />
          </Tabs>
        </div>
      </div>
      <div className="chart-content">
        {dataSource && dataSource.length > 1 ? (
          <>
            <Chart
              data={dataSource}
              padding={chartPadding}
              height={288}
              animate={true}
              scale={{
                datetime: {
                  type: 'timeCat',
                  mask: 'HH:mm',
                  // ticks: dataSource.filter((x, idx) => idx % 8 === 0).map((x) => x.datetime),
                },
                amount: {
                  type: 'linear',
                },
                avgPrice: {
                  type: 'linear',
                },
              }}
              forceFit
            >
              <Guide>
                <Guide.Text
                  top
                  position={['start', 'end']}
                  content={_t('73014e454a214000ace9', { currency: offerCurrency })} // 显示的文本内容
                  style={{
                    fill: theme.colors.text40,
                    fontSize: '12', // 文本大小
                  }} // 文本的图形样式属性
                  offsetX={-30} // x 方向的偏移量
                  offsetY={-18} // y 方向偏移量
                />
              </Guide>
              <Tooltip
                // showTitle={false}
                title="title"
                crosshairs={{
                  type: 'y',
                  style: {
                    stroke: theme.colors.cover16,
                    lineWidth: 1,
                    lineDash: [2, 2],
                  },
                }}
                itemTpl={itemTpl}
              />
              <Axis name="datetime" {...datetimeAxisConfig} />
              <Axis name="avgPrice" grid={false} {...avgPriceAxisConfig} />
              <Axis name="amount" grid={false} visible={false} />
              <Geom
                type="line"
                position="datetime*avgPrice"
                color={theme.colors.primary}
                tooltip={[
                  'datetime*avgPrice',
                  (datetime, avgPrice) => ({
                    title: dateTimeFormat({
                      lang,
                      date: datetime,
                      options: {
                        second: undefined,
                      },
                    }),
                    name: getName('avgPrice'),
                    value: avgPrice, // todo
                  }),
                ]}
              />
              <Geom
                type="interval"
                position="datetime*amount"
                color={theme.colors.cover16}
                tooltip={[
                  'datetime*amount',
                  (datetime, amount) => ({
                    title: dateTimeFormat({
                      lang,
                      date: datetime,
                      options: {
                        second: undefined,
                      },
                    }),
                    name: getName('amount'),
                    value: amount,
                  }),
                ]}
              />
              <Legend offsetY={-10} itemFormatter={getName} />
            </Chart>
            <Global
              styles={css`
                .g2-tooltip {
                  margin: 0 !important;
                  padding: 6px 8px !important;
                  color: #f3f3f3 !important;
                  background: #2e3034 !important;
                  border: 0.5px solid ${theme.colors.divider8} !important;
                  border-radius: 8px !important;
                  box-shadow: ${theme.shadows.middle} !important;
                  .trx-li:last-of-type {
                    svg {
                      path {
                        fill: rgba(243, 243, 243, 0.16) !important;
                      }
                    }
                  }
                }
              `}
            />
          </>
        ) : (
          <div className="emptyWrapper">
            <Empty />
          </div>
        )}
      </div>
    </PriceChartRoot>
  );
};

export default memo(TransactionChart);
