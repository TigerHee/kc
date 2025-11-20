/**
 * Owner: mike@kupotech.com
 */
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Flex, Text } from 'Bot/components/Widgets';
import ErrorBoundary from 'src/components/CmsComs/ErrorBoundary';
import FormatNumber from 'Bot/components/Common/FormatNumber';
import useClickAway from 'Bot/hooks/useClickAway';
import useStateRef from '@/hooks/common/useStateRef';
import { useTheme } from '@kux/mui';
import { localDateTimeFormat } from 'Bot/helper';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import { _t } from 'Bot/utils/lang';
import DialogRef from 'Bot/components/Common/DialogRef';
import SvgComponent from '@/components/SvgComponent';
import { MIcons } from 'Bot/components/Common/Icon';
import { ChangeRate, Profit } from 'Bot/components/ColorText';
import createChart from './createChart';
import { styleToString, timeOptions } from './util';
import { Box, Tooltip, Cover, MCollapse } from './style';
import { toolTipWidth, toolTipHeight, toolTipMargin } from './config';
import updateChartArea from './updateChart';

const showHint = (hint) => {
  return DialogRef.info({
    title: _t('intruction'),
    content: (
      <div>
        <Cover vc>
          <Flex vc mr={50}>
            <SvgComponent type="profit-instruction" fileName="botsvg" size={16} keepOrigin />
            <Text ml={8} fs={12} color="text60" lh="12px">
              {_t('profitrange')}
            </Text>
          </Flex>
          <Flex vc>
            <SvgComponent type="loss-instruction" fileName="botsvg" size={16} keepOrigin />
            <Text ml={8} fs={12} color="text60" lh="12px">
              {_t('lossrange')}
            </Text>
          </Flex>
        </Cover>
        <Text fs={16} lh="150%" color="text60">
          {hint}
        </Text>
      </div>
    ),
    okText: _t('gridform24'),
    cancelText: null,
  });
};

const defalt = {
  buyTime: '',
  sellTime: '',
  buyPrice: '',
  sellPrice: '',
  profit: '',
  isMakeUpData: false, // 是否补充过数据
};
/**
 * @description:  手动监听box变化
 * @param {*} boxRef
 * @param {*} chartRef
 * @param {*} autoSize
 * @return {*}
 */
const useListenSizeChange = ({ boxRef, chartRef, autoSize }) => {
  useEffect(() => {
    if (autoSize) return;
    let intersection;
    const dounceHandler = debounce((width, height) => {
      if (chartRef.current.chart && width && height) {
        chartRef.current.chart.resize(width, height);
      }
    }, 300);
    try {
      intersection = new ResizeObserver((entries) => {
        if (entries[0].contentRect) {
          dounceHandler(entries[0].contentRect.width, entries[0].contentRect.height);
        }
      });
      intersection.observe(boxRef.current);
    } catch (error) {
      console.log(error);
    }
    return () => {
      try {
        boxRef.current && intersection.unobserve(boxRef.current);
        intersection.disconnect();
      } catch (error) {
        console.log(error);
      }
    };
  }, []);
};
/**
 * @description:
 * @title 解释标题
 * @hint 解释内容
 * @return {*}
 */
const CreatePageChart = React.memo(
  ({
    autoSize = true,
    hasCollapse,
    updateChart = updateChartArea,
    onScrollLeftFetch,
    hourKline = [],
    arbitrageInfo = [],
    symbolInfo,
    title,
    hint,
    id,
    mb = 24,
    mt = 10,
    mode, // (create)
  }) => {
    title = title || _t('historytestback');
    hint = hint || _t('createpagechart');
    const theme = useTheme();
    const [tipData, setTipData] = useState(defalt);
    const boxRef = useRef();
    const arrowRef = useRef();
    const toolTipRef = useRef();
    const chartRef = useRef({
      chart: null,
      allSeries: {
        mainAreaSeries: {},
        colorAreaSeries: [],
      },
    });
    const useDataRef = useStateRef({
      hourKline,
      onScrollLeftFetch,
    });
    const prevDataRef = useRef(false);
    const { pricePrecision, priceIncrement } = symbolInfo;
    useEffect(() => {
      chartRef.current.chart = createChart({ boxRef, toolTipRef, theme, pricePrecision, autoSize });
      return () => {
        chartRef.current.chart.remove();
      };
    }, []);

    // 数据第一次加载回来，渲染后
    const whenDataFirstMount = useCallback(() => {
      const isDataFirstMount =
        prevDataRef.current === false && !isEmpty(useDataRef.current.hourKline);
      // 数据第一次加载回来后， 如果没有铺满， 就强制铺满
      if (isDataFirstMount) {
        const chart = chartRef.current.chart;
        const notFullCoverd = chart.timeScale()?.getVisibleLogicalRange()?.from < 0;
        if (notFullCoverd) {
          prevDataRef.current = true;
          chart.timeScale().fitContent();
        }
      }
      console.log('whenDataFirstMount', isDataFirstMount);
    }, []);

    useEffect(() => {
      if (hourKline.length > 0) {
        updateChart({ chartRef, hourKline, arbitrageInfo, mode, pricePrecision, priceIncrement });
        whenDataFirstMount();
      }
    }, [hourKline, arbitrageInfo]);

    const hideTooltip = useCallback(() => {
      if (!toolTipRef.current) return;
      toolTipRef.current.style.cssText = `display: none;`;
      setTipData(defalt);
      toolTipRef.current.clickArea = null;
    }, []);
    useEffect(() => {
      //  监听点击事件
      function myClickHandler(param) {
        if (!param.point) {
          return;
        }

        const colorAreaSeries = chartRef.current.allSeries.colorAreaSeries;
        const clickArea = colorAreaSeries.find(({ areaSeries }) => {
          const isInArea = param.seriesData.get(areaSeries);
          return !!isInArea;
        });

        if (clickArea) {
          if (toolTipRef.current.clickArea !== clickArea) {
            toolTipRef.current.clickArea = clickArea;
            setTipData(clickArea.arbitrage);

            const price = param.seriesData.get(clickArea.areaSeries).value;
            if (!price) {
              return;
            }
            const coordinate = clickArea.areaSeries.priceToCoordinate(price);
            let shiftedCoordinate = param.point.x - 50;
            if (coordinate === null) {
              return;
            }
            shiftedCoordinate = Math.max(
              0,
              Math.min(boxRef.current.clientWidth - toolTipWidth, shiftedCoordinate),
            );
            const coordinateY =
              coordinate - toolTipHeight - toolTipMargin > 0
                ? coordinate - toolTipHeight - toolTipMargin
                : Math.max(
                    0,
                    Math.min(
                      boxRef.current.clientHeight - toolTipHeight - toolTipMargin,
                      coordinate + toolTipMargin,
                    ),
                  );

            toolTipRef.current.style.cssText = styleToString({
              left: `${shiftedCoordinate}px`,
              top: `${coordinateY}px`,
              display: 'block',
            });
          }
        } else {
          hideTooltip();
        }
      }
      // 时间轴变化事件
      const myVisibleTimeRangeChangeHandler = debounce((newVisibleTimeRange) => {
        if (newVisibleTimeRange === null) {
          // handle null
          console.log('null');
        }
        // from:  day month year
        // handle new logical range
        const { from } = newVisibleTimeRange;
        const { onScrollLeftFetch: onScrollLeftFetchHere, hourKline: hourKlineHere } =
          useDataRef.current;
        if (!hourKlineHere.length) {
          return;
        }
        const lastTime = hourKlineHere[0].time;
        if (moment(lastTime).valueOf() === moment(from).valueOf() && onScrollLeftFetchHere) {
          console.log('fetchmore');
          // 拉去数据
          onScrollLeftFetchHere(lastTime);
        }

        hideTooltip();
      }, 400);
      // 监听图表布局变化
      const sizeChangeHandler = debounce(() => {
        // 布局变化，如何图表没有铺满，就强行fitContent
        const notFullCoverd = chart.timeScale()?.getVisibleLogicalRange()?.from < 0;
        if (notFullCoverd) {
          chart.timeScale().fitContent();
        }
      }, 100);
      const chart = chartRef.current?.chart;
      chart.subscribeCrosshairMove(myClickHandler);
      // 监听滚动图表的位置
      chart.timeScale().subscribeVisibleTimeRangeChange(myVisibleTimeRangeChangeHandler);
      // 监听图表布局变化
      chart.timeScale().subscribeSizeChange(sizeChangeHandler);
      // chart.timeScale().fitContent();
      return () => {
        if (chart) {
          chart.unsubscribeCrosshairMove && chart.unsubscribeCrosshairMove(myClickHandler);
          chart.timeScale() &&
            chart.timeScale().unsubscribeVisibleTimeRangeChange(myVisibleTimeRangeChangeHandler);
          chart.timeScale() && chart.timeScale().unsubscribeSizeChange(sizeChangeHandler);
        }
      };
    }, []);

    // 点击tooltip之外 就关闭tooltip
    // tooltipRef就是这里的span
    const excludesDoms = useMemo(() => {
      return [toolTipRef];
    }, []);
    useClickAway(hideTooltip, excludesDoms);

    const [open, setOpen] = useState(true);
    // autoSize为false的时候采用自己监听变化，
    // 主要是因为图表会显示在sideDrawer里面， display: none也会引起autoSize变化
    useListenSizeChange({ boxRef, chartRef, autoSize });

    return (
      <>
        <Flex vc sb color="text" fs={14} lh="130%" mt={mt}>
          <Flex vc cursor onClick={() => showHint(hint)}>
            <span className="mr-4">{title}</span> <MIcons.InfoContained size={16} color="icon60" />
          </Flex>
          {hasCollapse && (
            <Text cursor onClick={() => setOpen((e) => !e)}>
              {open ? (
                <MIcons.TriangleUp size={12} color="icon" />
              ) : (
                <MIcons.TriangleDown size={12} color="icon" />
              )}
            </Text>
          )}
        </Flex>
        <MCollapse in={open} className="chart-collapse">
          <Box id={id} mb={mb} ref={boxRef}>
            <Tooltip ref={toolTipRef}>
              <div>
                <Text as="div" color="text40" mb={4}>
                  {_t('date')}
                </Text>
                <Text as="div" color="text" mb={4}>
                  {localDateTimeFormat(tipData.buyTime, timeOptions)} -{' '}
                  {localDateTimeFormat(tipData.sellTime, timeOptions)}
                </Text>
              </div>
              <div className="flex-row">
                <span>{_t('entryprice')}</span>
                <span>
                  <FormatNumber value={tipData.buyPrice} precision={pricePrecision} />
                </span>
              </div>
              <div className="flex-row">
                <span>{_t('outprice')}</span>
                <span>
                  <FormatNumber value={tipData.sellPrice} precision={pricePrecision} />
                </span>
              </div>
              {!tipData.isMakeUpData && (
                <div className="flex-row">
                  <span>{_t('machinedetail20')}</span>
                  <span>
                    <ChangeRate value={tipData.profitRate} />
                  </span>
                </div>
              )}
              {!tipData.isMakeUpData && tipData.profit && mode !== 'create' && (
                <div className="flex-row">
                  <span>{_t('pureprofittext')}</span>
                  <span>
                    <Profit value={tipData.profit} />
                  </span>
                </div>
              )}
            </Tooltip>
          </Box>
        </MCollapse>
      </>
    );
  },
);

export default (props) => {
  return (
    <ErrorBoundary>
      <CreatePageChart {...props} />
    </ErrorBoundary>
  );
};
