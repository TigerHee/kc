/**
 * Owner: borden@kupotech.com
 */
import { useMemo, useContext, useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { useResponsive } from '@kux/mui';
import { WrapperContext, namespace } from '@/pages/Chart/config';
import { getSingleModule } from '@/layouts/utils';
import { event } from '@/utils/event';
import { useBoxCount } from './useBoxCount';
import { eventName } from '../config';

export const useChartInit = () => {
  const dispatch = useDispatch();
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);

  // symbol变化时进行数据校验
  useEffect(() => {
    if (currentSymbol) {
      dispatch({
        type: `${namespace}/genklineSymbols`,
        payload: { symbol: currentSymbol },
      });
    }
  }, [currentSymbol, dispatch]);
};

export const useChart = () => {
  const { isSingle } = getSingleModule();
  const { boxCount, onBoxCountChange } = useBoxCount();
  const { sm } = useResponsive();
  const screen = useContext(WrapperContext);
  const chartType = useSelector((state) => state[namespace].chartType);

  const [size, setSize] = useState('');
  const [showTab, setShowTab] = useState(true);

  useEffect(() => {
    // 响应式 height width 小于一定值后UI需要变化
    const handleReflow = debounce(({ width, height }) => {
      if (width <= 280) {
        setSize('minWidth');
      } else if (height <= 240) {
        setSize('minHeight');
      } else if (height <= 400) {
        setSize('middleHeight');
      } else {
        setSize('');
      }

      if (height <= 320) {
        setShowTab(false);
        if (boxCount === '4') {
          onBoxCountChange('1');
        }
      } else {
        setShowTab(true);
      }
    }, 500);
    event.on(eventName, handleReflow);
    return () => {
      event.off(eventName);
    };
  }, [boxCount, onBoxCountChange]);

  // 获取k线是否需要保存
  // 单开 -- X ｜ 多宫格 -- X ｜ H5 -- X | 组件width <= 280 -- X | 组件height <= 240 -- X | 非分时图
  const enableSave = useMemo(() => {
    return (
      !isSingle &&
      boxCount !== '4' &&
      sm &&
      screen !== 'sm' &&
      size !== 'minHeight' &&
      chartType !== 'timeline'
    );
  }, [isSingle, boxCount, sm, screen, size, chartType]);

  const sizeType = useMemo(() => {
    return !sm ? 'h5' : size;
  }, [sm, size]);

  return {
    enableSave,
    sizeType,
    showTab,
  };
};
