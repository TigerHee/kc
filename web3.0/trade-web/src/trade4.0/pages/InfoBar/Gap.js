/*
  * owner: borden@kupotech.com
  * desc: infoBar响应式实现
 */
import React, { useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { debounce, isNumber } from 'lodash';
import { useDispatch, useSelector } from 'dva';
import useIsMargin from '@/hooks/useIsMargin';
import useEtfCoin from 'utils/hooks/useEtfCoin';
import useStateRef from '@/hooks/common/useStateRef';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import marketSnapshotStore from 'src/pages/Trade3.0/stores/store.marketSnapshot';

const Container = styled.div`
  flex: 1;
  height: 100%;
`;
// 间隙宽度增加参与响应计算的buffer, 最好小于参与响应的模块中的最小模块宽度
const BUFFER = 30;
const GRA_WIDTH_BREAKPOINT = 24;
// 视窗调整方向。UP: 放大； DOWN: 缩小
const DIRECTION = {
  UP: 'UP',
  DOWN: 'DOWN',
};
let resizeObserver;

const Gap = React.memo(({ resetFuturesMore }) => {
  const ref = useRef();
  const preWidth = useRef();
  const locked = useRef(false);
  const maxMediaFlag = useRef();

  const etfCoin = useEtfCoin();
  const dispatch = useDispatch();
  const isMargin = useIsMargin();
  const infoBarMediaFlag = useSelector(state => state.setting.infoBarMediaFlag);
  const currentSymbol = useSelector(state => state.trade.currentSymbol);
  const realTimeMarketInfo = marketSnapshotStore.useSelector(
    (state) => state.marketSnapshot[currentSymbol],
  );
  // realTimeMarketInfo render完宽度才是准确的
  const isLoadedRealTimeMarketInfo = useStateRef(
    realTimeMarketInfo?.lastTradedPrice !== undefined,
  );

  maxMediaFlag.current = isMargin || etfCoin ? 5 : 4;

  useEffect(() => {
    const onResize = debounce((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        resetFuturesMore();
        if (
          !isLoadedRealTimeMarketInfo.current ||
          // ResizeObserver api拿到的宽度是浮点数，不能直接做全等比较
          Math.abs(width - preWidth.current) < 1
        ) {
          return;
        }
        let direction;
        if (isNumber(preWidth.current) && width > preWidth.current) {
          direction = DIRECTION.DOWN;
        } else if (isNumber(preWidth.current) && width < preWidth.current) {
          direction = DIRECTION.UP;
        }
        preWidth.current = width;
        // 加流程锁确保同批次更新不连锁触发，导致死循环
        if (!locked.current) {
          locked.current = true;
          queryMedia(direction);
        }
      }
    }, 200);

    if (ref.current) {
      resizeObserver = new ResizeObserver((entries) => {
        onResize(entries);
      });
      resizeObserver.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [isLoadedRealTimeMarketInfo, queryMedia, ref, resetFuturesMore]);

  const queryMedia = useMemoizedFn(async (direction) => {
    const width = ref.current?.offsetWidth;
    // console.log(`%c////////Gap width: ${width}`, 'color: red');
    // console.log(`%c////////infoBarMediaFlag: ${infoBarMediaFlag}`, 'color: red');
    // console.log(`%c////////direction: ${direction}`, 'color: red');
    // console.log(`//////-------------------------------------------`);

    const updateInfoBarMediaFlag = (v) => dispatch({
      type: 'setting/update',
      payload: { infoBarMediaFlag: v },
    });
    if (
      width < GRA_WIDTH_BREAKPOINT &&
      infoBarMediaFlag < maxMediaFlag.current &&
      (!direction || direction === DIRECTION.UP)
    ) {
      await updateInfoBarMediaFlag(infoBarMediaFlag + 1);
      queryMedia(DIRECTION.UP);
      return;
    } else if (
      infoBarMediaFlag > -1 &&
      width > GRA_WIDTH_BREAKPOINT + BUFFER &&
      (!direction || direction === DIRECTION.DOWN)
    ) {
      await updateInfoBarMediaFlag(infoBarMediaFlag - 1);
      queryMedia(DIRECTION.DOWN);
      return;
    }
    // 递归过量的校正
    if (
      width < GRA_WIDTH_BREAKPOINT &&
      infoBarMediaFlag < maxMediaFlag.current &&
      direction === DIRECTION.DOWN
    ) {
      await updateInfoBarMediaFlag(infoBarMediaFlag + 1);
    }
    preWidth.current = ref.current?.offsetWidth;
    // 释放流程锁
    locked.current = false;
  });

  return (
    <Container ref={ref} />
  );
});

export default Gap;
