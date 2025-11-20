/*
 * owner: borden@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Alert, NumberFormat, Spin, styled, Tab, Tabs, useEventCallback, useTheme } from '@kux/mui';
import Axis from 'bizcharts/lib/components/Axis';
import Chart from 'bizcharts/lib/components/Chart';
import Geom from 'bizcharts/lib/components/Geom';
import Tooltip from 'bizcharts/lib/components/Tooltip';
import ChangeRate from 'components/AllCrypto/components/ChangeRate';
import CoinCodeToName from 'components/common/CoinCodeToName';
import CoinIcon from 'components/common/CoinIcon';
import { Decimal, divide, formatLocalLangNumber, showDateTimeByZone, sub, toPercent } from 'helper';
import { useFetch } from 'hooks';
import { map, split } from 'lodash';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { getLimitKlines } from 'services/convert';
import { _t } from 'tools/i18n';

const IconBox = styled.div`
  position: relative;
  width: 48px;
  height: 32px;
  img {
    position: absolute;
    top: 0;
    &:first-of-type {
      left: 0;
    }
    &:last-of-type {
      right: 0;
    }
  }
`;
const BoldText = styled.span`
  font-size: 26px;
  font-weight: 600;
`;
const ChartContent = styled.div`
  height: 358px;
  margin-top: 34px;
  .g2-tooltip {
    margin: 0 !important;
    padding: 6px 8px !important;
    background: ${(props) => props.theme.colors.layer} !important;
    border: 0.5px solid ${(props) => props.theme.colors.divider8};
    border-radius: 8px !important;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04), 0px 0px 1px 0px rgba(0, 0, 0, 0.04) !important;
    li {
      margin: 0 !important;
      font-size: 12px !important;
      .label {
        color: ${(props) => props.theme.colors.text60} !important;
      }
      .value {
        margin-left: 30px;
        color: ${(props) => props.theme.colors.text} !important;
      }
    }
  }
  .g2-tooltip-title {
    display: none;
  }
  .g2-tooltip-value {
    margin-left: 0 !important;
  }
  .g2-tooltip-marker {
    display: none !important;
  }
`;

const RANGES = [
  {
    value: '1D',
    format: 'HH:mm',
    label: () => '24H',
  },
  {
    value: '1W',
    format: 'MM/DD',
    label: () => '1W',
  },
  {
    value: '1M',
    format: 'MM/DD',
    label: () => '1M',
  },
];
const RANGES_MAP = RANGES.reduce((a, b) => {
  a[b.value] = b;
  return a;
}, {});

const KChart = ({ symbol }) => {
  const { isRTL, currentLang } = useLocale();
  const { colors } = useTheme();

  const [range, setRange] = useState('1D');
  const [loading, setLoading] = useState(false);

  const [fromCurrency, toCurrency] = split(symbol, '-');

  const { runAsync, cancel, data } = useFetch(
    () => getLimitKlines({ range, fromCurrency, toCurrency }),
    {
      manual: true,
      pollingWhenHidden: false,
      pollingInterval: 5 * 60 * 1000, // 单位: s
    },
  );

  const dataSource = useMemo(() => {
    // 后端返回的String，不转成Int的话，y轴会乱序，跟后端@Ethan Shen沟通他们不好改，考虑到数据量不大，前端做下format
    return map(data?.klines, (v) => ({ ...v, open: new Decimal(v.open).toNumber() }));
  }, [data]);

  useEffect(() => {
    return () => {
      cancel();
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    runAsync().finally(() => {
      setLoading(false);
    });
    return () => {
      cancel();
    };
  }, [range, fromCurrency, toCurrency]);

  const handleChange = useEventCallback((event, val) => {
    setRange(val);
  });

  return (
    <Fragment>
      <div className="flex flex-center">
        <div className="flex-center">
          <IconBox>
            <CoinIcon coin={fromCurrency} width={32} height={32} />
            <CoinIcon coin={toCurrency} width={32} height={32} />
          </IconBox>
          <BoldText className="ml-12">
            <CoinCodeToName coin={fromCurrency} />/
            <CoinCodeToName coin={toCurrency} />
          </BoldText>
        </div>
        <Tabs
          value={range}
          size="medium"
          variant="line"
          indicator={false}
          onChange={handleChange}
          showScrollButtons={false}
          direction={isRTL ? 'rtl' : 'ltr'}
        >
          {RANGES.map(({ value, label }) => {
            return <Tab key={value} value={value} label={label()} />;
          })}
        </Tabs>
      </div>
      <div className="flex-center mt-14">
        <BoldText>
          <NumberFormat lang={currentLang}>{data?.klines?.at(-1)?.close || '-'}</NumberFormat>
        </BoldText>
        <ChangeRate size="m2d" className="ml-4" value={data?.change} />
      </div>
      <Spin spinning={loading} size="small">
        <ChartContent>
          <Chart
            forceFit
            key={range}
            height={358}
            padding="auto"
            data={dataSource}
            // animate={false}
            scale={{
              time: {
                type: 'timeCat',
                // range: [0.05, 1],
                tickCount: 6, // 这里可以调整刻度的数量
                mask: RANGES_MAP[range]?.format || 'MM/DD',
              },
              open: {
                alias: _t('rmzP7Yr7dybTnpvfMZEiK4'),
                tickCount: 5, // 这里可以调整刻度的数量
              },
            }}
          >
            <Axis
              name="time"
              grid={null}
              tickLine={null}
              line={{ stroke: colors.cover8, lineWidth: 0.5 }}
              label={{
                // formatter: (val) => showDateTimeByZone(val, undefined, 0),
                textStyle: {
                  fontSize: '12',
                  fill: colors.text40,
                },
              }}
            />
            <Axis
              name="open"
              grid={null}
              position="right"
              line={{ stroke: colors.cover8, lineWidth: 0.5 }}
              label={{
                formatter: (val) =>
                  formatLocalLangNumber({
                    data: val,
                    lang: currentLang,
                  }),
                textStyle: {
                  fontSize: '12',
                  fill: colors.text40,
                },
              }}
            />
            <Tooltip
              useHTML
              showTitle={false}
              itemTpl="<li>{value}</li>"
              crosshairs={{
                type: 'cross',
                style: { lineDash: [4, 4] },
              }}
            />
            <Geom
              type="line"
              position="time*open"
              size={1}
              color={'#1E8AF4'}
              shape="smooth"
              tooltip={[
                'time*open*close*high*low',
                (time, open, close, high, low) => {
                  return {
                    value: `
                      <div class="flex">
                        <span class="label">${_t('time')}</span>
                        <span class="value">${showDateTimeByZone(time)}</span>
                      </div>
                      <div class="flex">
                        <span class="label">${_t('rmzP7Yr7dybTnpvfMZEiK4')}</span>
                        <span class="value">${open}</span>
                      </div>
                      <div class="flex">
                        <span class="label">${_t('23LB2Vd8LXj7LiKmfzMwRm')}</span>
                        <span class="value">${close}</span>
                      </div>
                      <div class="flex">
                        <span class="label">${_t('price.high')}</span>
                        <span class="value">${high}</span>
                      </div>
                      <div class="flex">
                        <span class="label">${_t('price.low')}</span>
                        <span class="value">${low}</span>
                      </div>
                      <div class="flex">
                        <span class="label">${_t('price.rate')}(%)</span>
                        <span class="value">${formatLocalLangNumber({
                          data: toPercent(divide(sub(close, open), open), ''),
                          lang: currentLang,
                          interceptDigits: 2,
                        })}</span>
                      </div>
                    `,
                  };
                },
              ]}
            />
          </Chart>
        </ChartContent>
      </Spin>
      <Alert
        showIcon
        type="warning"
        className="mt-28"
        title={_t('fVeGGxXKyZKigpENkPnXWJ')}
        style={{ fontWeight: 400 }}
      />
    </Fragment>
  );
};

export default React.memo(KChart);
