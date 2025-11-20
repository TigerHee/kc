/**
 * Owner: Ray.Lee@kupotech.com
 * 改造合约融合，迁移代码，未改动代码跟逻辑 @2023.08.18
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

import { ScrollWrapper, ScrollContent, ScorllItem } from './style';

import Item from './Item';
import { useDispatch, useSelector } from 'dva';
import marketSnapshotStore from 'src/pages/Trade3.0/stores/store.marketSnapshot';

import useWindowSize from '@/hooks/common/useWindowSize';
import useWorkerSubscribe, { getTopic } from '@/hooks/useWorkerSubscribe';
import * as ws from '@kc/socket';
import { _t } from 'src/utils/lang';
import { useIsRTL } from '@/hooks/common/useLang';
import usePolling from '@/hooks/usePolling';

export const RenderScrollItem = memo(
  forwardRef((props, ref) => {
    const { records, dispatch, ...restProps } = props;

    // 更新各模块 symbolCode 数据
    const handleItemClick = useCallback((symbolCode) => {
      dispatch({
        type: '$tradeKline/routeToSymbol',
        payload: {
          symbol: symbolCode,
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

  const favSymbols = useSelector((state) => state.tradeMarkets.favSymbols);
  const popularSymbols = useSelector((state) => state.tradeMarkets.popularSymbols);
  const symbolsMap = useSelector((state) => state.symbols.symbolsMap);
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);
  const firstChildRef = useRef(null);

  const { width } = useWindowSize();
  const marketSnapshotMap = marketSnapshotStore.useSelector((state) => state.marketSnapshot);

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

  useWorkerSubscribe(getTopic(ws.Topic.MARKET_SNAPSHOT, curTopicSymbols));

  const { startPolling, cancelPolling } = usePolling(
    'marketSnapshot/pullDataBySymbols',
    'marketSnapshot/registerSymbolbarPolling',
  );

  // 最多取 15 个
  const records = curTopicSymbols?.slice(0, 15)?.map((symbolCode) => {
    const { precision = 8 } = symbolsMap[symbolCode] || {};
    const item = marketSnapshotMap[symbolCode];
    return item
      ? { ...item, precision }
      : {
          symbolCode,
          lastTradedPrice: 0,
          changeRate: 0,
          precision,
        };
  });

  // 需要先判断第一份的宽度是否超出了容器宽度，超出了才开启动画效果并复制一份做循环滚动
  useLayoutEffect(() => {
    const { clientWidth } = wrapperRef.current;
    const { clientWidth: childClientWidth } = firstChildRef.current;

    const hasAnimation = childClientWidth > clientWidth;
    setAnimationInfo({
      hasAnimation,
      duration: records?.length * 2 * 7 || 100,
    });
  }, [width, curType, curTopicSymbols, records.length]);

  useEffect(() => {

    if (curTopicSymbols?.length) {
      startPolling({ symbols: curTopicSymbols });
    }

    return () => {
      cancelPolling();
    };
  }, [curTopicSymbols]);

  useEffect(() => {
    dispatch({ type: 'tradeMarkets/getPopularSymbols' });
    dispatch({ type: 'tradeMarkets/pullUserFavSymbols' });
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
