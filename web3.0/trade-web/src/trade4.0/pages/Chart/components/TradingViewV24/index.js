/**
 * Owner: jessie@kupotech.com
 */
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import useTheme from '@kux/mui/hooks/useTheme';
import Spin from '@mui/Spin';
import { isNil, cloneDeep, uniq, debounce, map, get, find, remove } from 'lodash';
import config from 'config';
import { evtEmitter } from 'helper';
import { namespace } from '@/pages/Chart/config';
import { useKlineSymbols } from '@/pages/Chart/hooks/useKlineSymbols';
import { useChartType } from '@/pages/Chart/hooks/useChartType';
import { useKlineType } from '@/pages/Chart/hooks/useChartToolBar';
import { useChartSavedData } from '@/pages/Chart/hooks/useChartSavedData';
import storage from '@/pages/Chart/utils/index';
import { useTransformAmount } from '@/hooks/futures/useUnit';
import { isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';
import { FUTURES } from '@/meta/const';
import { SWITCH_KLINE_SYMBOL_DONE } from '@/meta/chart';
import { transferOldCacheData } from './utils/updateMerge';
import { _t } from 'utils/lang';
import { KLINE_INDEX_TEMPLATES } from '@/storageKey/chart';
import {
  enhanceTVWidget,
  getOverridesByTheme,
  getUdfTime,
  getWidgetOptions,
  // createConfigByTradeType,
  // createIndexLine,
} from './utils';
import SocketDataWrap from './SocketDataWrap';
import {
  needApplyOverrides,
  setTvTheme,
  getStudyDrawData,
  setStudyDrawData,
} from './utils/savedState';
import StudyModal from './StudyModal';
import Header from './Header';
import { Wrapper, TVWrapper } from './style';
import { getOriginSymbolForKlineSymbol } from './Header/PriceSelect/hooks';

const { siteCfg } = config;
const futuresHost = siteCfg['API_HOST.FUTURES'];

// 限制保存时间，初始化时一段时间内不能触发保存
const LimitSaveTime = 5 * 1000;
// 涉及变更k线样式或配置的操作，更新此变量
const LOCALSTORAGEPREV = 'v24.2';

let _temp;
const event = evtEmitter.getEvt('trade.kline');

const TVContainer = ({
  id,
  symbol,
  interval,
  overrides,
  className = '',
  chartType = 'normal', // 图表类型 normal(default) ｜ multi ｜timeline
  sizeType, // 图表尺寸 h5 | minWidth ｜ minHeight | middleHeight(小于400) | 空
  enableSave,
  updateGranularity,
  children,
  tradeType,
  originSymbol: propsOriginSymbol,
}) => {
  const tvWidgetRef = useRef(null);
  const datafeedRef = useRef(null);
  const symbolStackRef = useRef([]);
  const firstSaveRef = useRef(false);
  const localSaveRef = useRef(false);
  const serverSaveRef = useRef(false);

  const { colors, currentTheme: theme } = useTheme();
  const { updateKlineConf } = useChartSavedData();
  const { onSymbolChange } = useKlineSymbols();
  const { onChartTypeChange } = useChartType();
  const { klineType, onKlineTypeChange } = useKlineType();

  // 获取原始 symbol 值，合约有 symbol 切换逻辑
  const originSymbol = useMemo(() => {
    if (!isSpotTypeSymbol(symbol) && tradeType === FUTURES) {
      return propsOriginSymbol || getOriginSymbolForKlineSymbol(symbol);
    }
    return symbol;
  }, [propsOriginSymbol, symbol, tradeType]);

  const { quantityToBaseCurrency } = useTransformAmount({ tradeType, symbol: originSymbol });
  const dispatch = useDispatch();

  const [chartReady, setChartReady] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [begin, setBegin] = useState(0);

  const wsConnected = useSelector((state) => state.socket.wsConnected);
  const lang = useSelector((state) => state.app.currentLang);
  const activeStudies = useSelector((state) => state[namespace].activeStudies);

  const createChart = useCallback(() => {
    const udfTime = getUdfTime(!wsConnected); // 轮询时间
    datafeedRef.current = new Datafeeds.UDFCompatibleDatafeed(
      tradeType === FUTURES ? futuresHost : _GATE_WAY_,
      udfTime,
      tradeType,
    );
    datafeedRef.current.transformData = (data) => {
      const amount = quantityToBaseCurrency(data);
      return amount;
    };
    // 创建图表时调用一次 (因为tv升级，cache key有变化，这里先处理一下旧的key)
    transferOldCacheData(symbol);
    const savedData = getSavedDataObj();
    const Widget = window.TradingView.widget;
    const widgetOptions = getWidgetOptions({
      symbol,
      id,
      lang,
      datafeed: datafeedRef.current,
      chartType,
      theme,
      overrides,
      interval,
      colors,
      sizeType,
    });

    if (savedData) {
      widgetOptions.saved_data = savedData;
    }

    // K线设置
    const tvWidget = new Widget(widgetOptions);
    // 用于获取加载的指标
    const getAllStudies = debounce(() => {
      try {
        if (
          tvWidget &&
          tvWidget.chart &&
          tvWidget.chart() &&
          tvWidget.chart().getAllStudies &&
          tvWidget.chart().getAllStudies()
        ) {
          const studies = tvWidget
            .chart()
            .getAllStudies()
            .map((v) => v.name);
          // remove(studies, (item) => item === 'Compare');

          // console.log(studies, 'studies~~~~~~');

          if (studies) {
            const _studies = uniq(studies);
            dispatch({
              type: `${namespace}/update`,
              payload: { activeStudies: _studies },
            });
          }
        }
      } catch (error) {
        console.log(error || 'getAllStudies error');
      }
    }, 1000);

    tvWidget.onChartReady(() => {
      try {
        // ---------- 加载不同类型图表特有方法 start ---------
        // 多宫格时，在K线添加点击选中事件
        if (chartType === 'multi') {
          const multiBoxEle = document.getElementById(`${originSymbol}_${chartType}`);
          if (multiBoxEle) {
            const iFrameID = multiBoxEle.getElementsByTagName('iframe')[0];
            iFrameID.contentDocument.addEventListener('click', () => {
              onSymbolChange(originSymbol);
            });
          }
        }

        // if (chartType !== 'timeline') {
        //   createConfigByTradeType(tvWidget, tradeType, symbol);
        // } else {
        //   tvWidget.chart().removeAllStudies();
        // }

        if (chartType === 'timeline') {
          tvWidget.chart().removeAllStudies();
        }

        // ---------- 加载不同类型图表特有方法 end ---------

        // ---------- 获取图表中的数值 start ---------
        // 用于获取时间粒度列表
        if (tvWidget?.getIntervals) {
          dispatch({
            type: `${namespace}/update`,
            payload: { intervalList: tvWidget.getIntervals() },
          });
        }

        getAllStudies();

        // chart ready 后记录from，用于获取历史点位
        const { from: _from } = tvWidget.chart().getVisibleRange() || {};
        setBegin(_from);

        // 范围变化时重新复制
        tvWidget
          .chart()
          .onVisibleRangeChanged()
          .subscribe(null, ({ from }) => {
            setBegin(from);
          });

        // 如果不存在saveData，则再次应用主题
        if (!savedData) {
          tvWidgetRef.current.applyOverrides(getOverridesByTheme({ colors }));
        }
        // ---------- 获取图表中的数值 end ---------

        // k线变动时获取存储信息
        tvWidget.subscribe('onAutoSaveNeeded', handleSaveChart);

        // 指标变动事件
        tvWidget.subscribe('study_event', () => {
          getAllStudies();
        });

        // 数据加载完成
        tvWidget.chart().dataReady(() => {
          setDataReady(true);
        });

        // 判断symbolStack是否有记录，如果有取出栈顶数据，调用setSymbol，实现时间无缝衔接
        if (symbolStackRef.current?.length > 0) {
          const _lastone = symbolStackRef.current[0] || '';
          // 判断是否与当前symbo相同
          const currentSymbol = tvWidget.chart().symbol() || '';

          let _symbol = currentSymbol;
          if (currentSymbol?.indexOf(':') > -1) {
            _symbol = currentSymbol.split(':')?.[1];
          }
          const canSwitchSymbol = _lastone !== _symbol;

          if (canSwitchSymbol) {
            const currentResolution = tvWidgetRef.current.chart().resolution();
            tvWidget.setSymbol(_lastone, currentResolution, () => {});
          }
          symbolStackRef.current = [];
        }

        // 时间周期改变事件，监听点击图表下方事件
        tvWidget
          .activeChart()
          .onIntervalChanged()
          .subscribe(null, (currentInterval) => {
            // 点击下方的周期，如果当前在分时图，此时需要切换普通视图
            if (currentInterval !== 1 && chartType === 'timeline') {
              onChartTypeChange('normal');
            }
            updateGranularity(currentInterval);
          });
      } catch (e) {
        console.log(e || 'tvWidget onChartReady error');
      }

      enhanceTVWidget(tvWidget);

      setChartReady(true);
    });

    tvWidgetRef.current = tvWidget;
  }, [
    wsConnected,
    tradeType,
    getSavedDataObj,
    symbol,
    id,
    lang,
    chartType,
    theme,
    overrides,
    interval,
    colors,
    sizeType,
    quantityToBaseCurrency,
    dispatch,
    handleSaveChart,
    originSymbol,
    onSymbolChange,
    onChartTypeChange,
    updateGranularity,
  ]);

  // 获取K线指标及画线信息
  const getSavedDataObj = useCallback(() => {
    if (!enableSave) return;
    const savedData = getStudyDrawData();
    return savedData;
  }, [enableSave]);

  // 保存k线信息
  const handleSaveChart = useCallback(() => {
    if (!enableSave || !tvWidgetRef.current) return;
    tvWidgetRef.current.save((state) => {
      // 存储图表指标及画线工具信息
      setStudyDrawData(state);
    });
  }, [dispatch, enableSave]);

  // init
  useEffect(() => {
    createChart();
    return () => {
      // 清除tvWidget
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
      }

      // 清除datafeed
      if (datafeedRef.current) {
        datafeedRef.current.destroy();
        datafeedRef.current = null;
      }

      // 清空symbolStack
      if (symbolStackRef.current) {
        symbolStackRef.current = [];
      }

      if (localSaveRef.current) {
        localSaveRef.current = false;
      }

      if (serverSaveRef.current) {
        serverSaveRef.current = false;
      }

      if (firstSaveRef.current) {
        firstSaveRef.current = false;
      }
    };
  }, []); // eslint-disable-line

  // 切换symbol
  useEffect(() => {
    if (tvWidgetRef.current && symbolStackRef.current && symbol) {
      // chart未准备好时，调用setSymbol会报错，将setSymbol需要的参数放置到symbolStack中去。
      // symbolStack也可以直接替换成单个的历史记录，调用时只需最新的记录。
      if (!chartReady) {
        symbolStackRef.current.unshift(symbol);
        return;
      }
      try {
        const currentSymbol = tvWidgetRef.current.chart().symbol();

        let _symbol = currentSymbol;
        if (currentSymbol?.indexOf(':') > -1) {
          _symbol = currentSymbol.split(':')?.[1];
        }
        const canSwitchSymbol = _symbol !== symbol;
        if (canSwitchSymbol) {
          const currentResolution = tvWidgetRef.current.chart().resolution();
          tvWidgetRef.current.setSymbol(symbol, currentResolution, () => {
            // 切换完成，发送一个切换完成的消息
            event.emit(SWITCH_KLINE_SYMBOL_DONE);
          });
        }
      } catch (e) {
        console.error(`${e || 'tvWidget changeSymbol error'}`);
      }
    }
  }, [symbol, chartReady]);

  // theme
  useEffect(() => {
    if (tvWidgetRef.current && chartReady && theme) {
      try {
        // 如果切换过主题，则执行applyOverrides
        if (needApplyOverrides(theme)) {
          tvWidgetRef.current.changeTheme(theme).then(() => {
            if (tvWidgetRef.current) {
              tvWidgetRef.current.applyOverrides(getOverridesByTheme({ colors }));
              setTvTheme(theme);
            }
          });
        }
      } catch (e) {
        console.error(`${e || 'tvWidget changeTheme error'}`);
      }
    }
  }, [theme, chartReady, colors]);

  // interval
  useEffect(() => {
    if (tvWidgetRef.current && chartReady && interval) {
      try {
        const currentResolution = tvWidgetRef.current.chart().resolution();
        if (currentResolution !== interval) {
          tvWidgetRef.current.chart().setResolution(interval);
        }
      } catch (e) {
        console.error(`${e || 'tvWidget setResolution error'}`);
      }
    }
  }, [interval, chartReady]);

  // klineType
  useEffect(() => {
    if (tvWidgetRef.current && chartReady && !isNil(klineType)) {
      // 当chartType为timeline时不处理
      try {
        const currentKlineType = tvWidgetRef.current.chart().chartType();
        if (chartType === 'normal' && currentKlineType !== klineType) {
          tvWidgetRef.current.chart().setChartType(klineType);
        }
      } catch (e) {
        console.error(`${e || 'tvWidget setChartType error'}`);
      }
    }
  }, [klineType, chartType, chartReady]);

  // 更新心跳机制
  useEffect(() => {
    if (!isNil(wsConnected) && datafeedRef.current?._barsPulseUpdater?.updatePoling) {
      const udfTime = getUdfTime(!wsConnected);
      datafeedRef.current._barsPulseUpdater.updatePoling(udfTime);
    }
  }, [wsConnected]);

  const headerHidden = useMemo(() => {
    return chartType === 'multi';
  }, [chartType]);

  return (
    <Wrapper className={`${className}`}>
      {tvWidgetRef.current ? (
        <Header
          symbol={originSymbol}
          tvWidget={tvWidgetRef.current}
          hidden={headerHidden}
          interval={interval}
          onIntervalChange={updateGranularity}
          chartType={chartType}
          onChartTypeChange={onChartTypeChange}
          klineType={klineType}
          onKlineTypeChange={onKlineTypeChange}
          tradeType={tradeType}
        />
      ) : null}

      <TVWrapper full={headerHidden}>
        <div id={id} />
      </TVWrapper>

      {tvWidgetRef.current && datafeedRef.current ? (
        <SocketDataWrap
          symbol={symbol}
          interval={interval}
          chartReady={chartReady}
          tradeType={tradeType}
          tvWidget={tvWidgetRef.current}
          datafeed={datafeedRef.current}
        />
      ) : null}

      {tvWidgetRef.current && chartReady && dataReady
        ? React.Children.map(children, (child) => {
            return React.cloneElement(child, { tvWidget: tvWidgetRef.current, begin });
          })
        : null}

      {tvWidgetRef.current && chartReady ? (
        <StudyModal activeStudies={activeStudies} tvWidget={tvWidgetRef.current} />
      ) : null}

      <Spin className={`spin ${chartReady ? 'disabled' : ''}`} spinning={!chartReady} />
    </Wrapper>
  );
};

export default TVContainer;
