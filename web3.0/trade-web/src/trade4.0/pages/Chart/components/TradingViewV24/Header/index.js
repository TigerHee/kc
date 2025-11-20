/**
 * Owner: jessie@kupotech.com
 */
import React, { useEffect, useCallback, memo } from 'react';
import { useDispatch } from 'dva';
import { useResponsive } from '@kux/mui';
import Tooltip from '@mui/Tooltip';
import { KLINE_KLINETYPE } from '@/storageKey/chart';
import storage from '@/pages/Chart/utils/index';
import { namespace } from '@/pages/Chart/config';
import { _t } from 'utils/lang';
import { HeaderWrapper, Left, Right, HeaderIcon, HeaderIconItem, TextItem } from '../style';
import IntervalSelectBar from '../IntervalSelectBar';
import KlineTypeSelectBar from '../KlineTypeSelectBar';
import ExtraToolSelectBar from '../ExtraToolSelectBar';
import PriceSelect from './PriceSelect';

const { setItem } = storage;

const Header = ({
  tvWidget,
  interval,
  chartType,
  klineType,
  onIntervalChange,
  onChartTypeChange,
  onKlineTypeChange,
  hidden,
  symbol,
  tradeType,
}) => {
  const dispatch = useDispatch();
  const { sm } = useResponsive();

  const windowOpen = useCallback((winUrl) => {
    const opened = window.open(winUrl, '_blank');
    // open被拦截，在当前页面打开
    if (!opened) {
      window.location.href = winUrl;
    }
  }, []);

  useEffect(() => {
    // 快照
    tvWidget.subscribe('onScreenshotReady', (key) => {
      windowOpen(`https://www.tradingview.com/x/${key}`);
    });
    return () => {};
  }, [windowOpen, tvWidget]);

  const handleTimeline = () => {
    onChartTypeChange('timeline');
    onIntervalChange(1);
    if (tvWidget?.chart()?.setChartType) {
      tvWidget.chart().setChartType(2);
    }
  };

  const handleInterval = (v) => {
    onChartTypeChange('normal');
    onIntervalChange(v);
    if (tvWidget?.chart()?.setChartType) {
      tvWidget.chart().setChartType(klineType);
    }
  };

  // 切换k线类型
  const handleKlineType = (v) => {
    setItem(KLINE_KLINETYPE, v);
    onKlineTypeChange(v);
  };

  const handleActionById = (actionId) => {
    if (tvWidget?.chart()?.executeActionById) {
      tvWidget.chart().executeActionById(actionId);
    }
  };

  const onStudyModalChange = () => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        modalVisible: true,
      },
    });
  };

  const ItemTooltip = useCallback(
    ({ title, children }) => {
      if (!sm) {
        return children;
      }
      return (
        <Tooltip size="small" placement="top" title={title}>
          {children}
        </Tooltip>
      );
    },
    [sm],
  );

  return (
    <HeaderWrapper hidden={hidden} className="no-scrollbar">
      <Left>
        <TextItem onClick={handleTimeline} className={chartType === 'timeline' ? 'active' : ''}>
          {_t('iejhffnrAuYuHtjQe1esXG')}
        </TextItem>
        <IntervalSelectBar
          interval={chartType === 'timeline' ? '' : interval}
          onIntervalChange={handleInterval}
        />

        <KlineTypeSelectBar klineType={klineType} onKlineTypeChange={handleKlineType} />

        <ItemTooltip title={_t('uWT9VTgRJc5drhUjsdfx8m')}>
          <HeaderIconItem style={{ margin: 0 }}>
            <HeaderIcon type="indicators" size={16} fileName="chart" onClick={onStudyModalChange} />
          </HeaderIconItem>
        </ItemTooltip>

        <ExtraToolSelectBar />

        <ItemTooltip title={_t('2UyZ1u27wrDfHrm6yovepQ')}>
          <HeaderIconItem>
            <HeaderIcon
              type="setting"
              size={16}
              fileName="chart"
              onClick={() => handleActionById('chartProperties')}
            />
          </HeaderIconItem>
        </ItemTooltip>

        {/* <Tooltip size="small" placement="top" title={'撤销'}>
          <HeaderIconItem>
            <HeaderIcon
              type="left-arrow"
              size={16}
              fileName="chart"
              onClick={() => handleActionById('undo')}
            />
          </HeaderIconItem>
        </Tooltip>

        <Tooltip size="small" placement="top" title={'重做'}>
          <HeaderIconItem className="ml-4">
            <HeaderIcon
              type="right-arrow"
              size={16}
              fileName="chart"
              onClick={() => handleActionById('redo')}
            />
          </HeaderIconItem>
        </Tooltip> */}

        <ItemTooltip title={_t('vgKQvHA2WmkKt1hBjcXqZQ')}>
          <HeaderIconItem>
            <HeaderIcon
              type="snatshop"
              size={16}
              fileName="chart"
              onClick={() => {
                tvWidget.takeScreenshot();
              }}
            />
          </HeaderIconItem>
        </ItemTooltip>

        {/* 比较或添加商
        <HeaderIcon
          type="add"
          size={16}
          fileName="chart"
          onClick={() => handleActionById('compareOrAdd')}
        /> */}
      </Left>
      <Right>
        <PriceSelect symbol={symbol} tradeType={tradeType} />
        <ItemTooltip title={_t('nhoDkhEng98GfAJUspLF1o')}>
          <HeaderIconItem>
            <HeaderIcon
              type="full"
              size={16}
              fileName="chart"
              onClick={() => {
                tvWidget.startFullscreen();
              }}
            />
          </HeaderIconItem>
        </ItemTooltip>
      </Right>
    </HeaderWrapper>
  );
};

export default memo(Header);
