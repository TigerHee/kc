/**
 * Owner: garuda@kupotech.com
 */
import React, {
  memo,
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useMemo,
  forwardRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filter, includes, map, get, find } from 'lodash';

import useWindowSize from '@/hooks/common/useWindowSize';

import { useIsRTL } from '@/hooks/common/useLang';
import { useFuturesSymbols } from '@/hooks/common/useSymbol';

import { _t } from 'src/utils/lang';

import { ScrollWrapper, ScrollContent, ScorllItem } from './style';

import { FuturesItem as Item } from './Item';
import { FUTURES } from 'src/trade4.0/meta/const';

export const RenderScrollItem = memo(
  forwardRef((props, ref) => {
    const { records, dispatch, ...restProps } = props;

    // 更新各模块 symbolCode 数据
    const handleItemClick = useCallback((symbol) => {
      dispatch({
        type: '$tradeKline/routeToSymbol',
        payload: {
          symbol,
          toTradeType: FUTURES,
        },
      });
    }, []);
    return (
      <ScorllItem {...restProps} ref={ref}>
         {records.map((item, idx) => (
          <Item key={idx} data={item} onClick={handleItemClick} />
        ))}
      </ScorllItem>
    );
  }),
);

/**
 * 渲染热门和自选币种，最多15个；超出宽度才复制一份并开启动画效果
 * 需要订阅 MARKET_SNAPSHOT Topic 实时更新数据
 */
const ScrollerContent = memo((props) => {
  const { curType } = props;

  const favSymbols = useSelector((state) => state.futuresMarket.favSymbols);
  const recommended = useSelector((state) => state.futuresMarket.recommended);
  const sortedMarkets = useSelector((state) => state.futuresMarket.sortedMarkets);
  const symbolsMap = useFuturesSymbols();

  const dispatch = useDispatch();
  const wrapperRef = useRef(null);
  const firstChildRef = useRef(null);

  const { width } = useWindowSize();
  // const marketSnapshotMap = {};

  const popularSymbols = useMemo(() => {
    const { hotSymbols = [] } = recommended || {};
    let hotSymbolList = [];
    let markets = [];
    if (hotSymbols.length) {
      // 过滤掉维护中的合约
      hotSymbolList = filter(hotSymbols, (item) => symbolsMap[item]) || [];
      // 大于15则只取15
      hotSymbolList = hotSymbolList.slice(0, 15);
      map(hotSymbolList, (item) => {
        const marketInfo = find(sortedMarkets, { symbol: item });
        if (marketInfo) {
          markets.push(marketInfo);
        }
      });
    }

    const len = markets.length;
    const filteredList = filter(sortedMarkets, (n) => !includes(hotSymbolList, n.symbol));
    markets = markets.concat(filteredList.slice(0, 15 - len));

    return markets;
  }, [symbolsMap, recommended, sortedMarkets]);

  const curTopicSymbols = useMemo(() => {
    const favPopularSymbolsMap = {
      1: favSymbols,
      2: popularSymbols,
    };
    return favPopularSymbolsMap[curType] || [];
  }, [curType, favSymbols, popularSymbols]);

  const [animationInfo, setAnimationInfo] = useState({
    hasAnimation: false,
    duration: 100,
  });

  // 构造 records 数据
  const records = useMemo(() => {
    return map(curTopicSymbols, (item) => {
      const symbol = item.symbol || item;

      let changeRate;
      let lastTradePrice;

      // 判断 changeRate 是否存在，不存在则从 marketList 里面取
      if (item.changeRate != null || item.priceChgPct != null) {
        changeRate = item.changeRate || item.priceChgPct;
      } else {
        changeRate = get(
          find(sortedMarkets, (items) => items.symbol === symbol),
          'priceChgPct',
          '0',
        );
      }

      lastTradePrice = get(
        find(sortedMarkets, (items) => items.symbol === symbol),
        'lastPrice',
        '0',
      );
      if (lastTradePrice === '0') {
        lastTradePrice = item.lastPrice || item.lastTradePrice || '0';
      }

      return {
        symbol,
        lastTradePrice,
        changeRate,
        tickSize: get(symbolsMap[symbol], 'tickSize', '0.01'),
      };
    });
  }, [curTopicSymbols, sortedMarkets, symbolsMap]);

  // 需要先判断第一份的宽度是否超出了容器宽度，超出了才开启动画效果并复制一份做循环滚动
  useLayoutEffect(() => {
    const { clientWidth } = wrapperRef.current;
    const { clientWidth: childClientWidth } = firstChildRef.current;

    const hasAnimation = childClientWidth > clientWidth;
    setAnimationInfo({
      hasAnimation,
      duration: records?.length * 2 * 7 || 100,
    });
  }, [width, curType, records.length]);

  useEffect(() => {
    dispatch({ type: 'futuresMarket/getRecommendedList' });
    dispatch({ type: 'futuresMarket/getFuturesFavSymbols' });
  }, [dispatch]);

  const isRTL = useIsRTL();

  return (
    <ScrollWrapper ref={wrapperRef}>
      <ScrollContent isRTL={isRTL} {...animationInfo}>
        <RenderScrollItem records={records} dispatch={dispatch} ref={firstChildRef} />
        {animationInfo.hasAnimation && <RenderScrollItem records={records} dispatch={dispatch} />}
      </ScrollContent>
    </ScrollWrapper>
  );
});
export default ScrollerContent;
