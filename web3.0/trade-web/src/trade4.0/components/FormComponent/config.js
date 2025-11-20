/**
 * Owner: garuda@kupotech.com
 * FormContext 的声明文件，存放 Form 相关的 Context 内容
 */

import { createContext, useContext, useCallback } from 'react';

export const TOOLTIP_EVENT_KEY = 'tradeOrder@trade_form_tooltip';

// 定义 action 类型
export const CLOSE_TOOLTIP = 'CLOSE_TOOLTIP';
export const UPDATE_TOOLTIP = 'UPDATE_TOOLTIP';

export const FormTooltipContext = createContext();
export const FormTooltipDispatchContext = createContext();

// 获取 tooltip 的值
export const useTooltip = () => {
  return useContext(FormTooltipContext);
};

// 获取 tooltip 的 dispatch
export const useTooltipDispatch = () => {
  return useContext(FormTooltipDispatchContext);
};

// 设置 Tooltip 中对应 name 的 操作，返回设置 false 跟 title 的方法
export const useSetTooltip = () => {
  const dispatch = useTooltipDispatch();

  const onSetTooltipClose = useCallback((data) => {
    dispatch({ type: CLOSE_TOOLTIP, data });
  }, [dispatch]);

  const onSetTooltipTitle = useCallback((data) => {
    dispatch({ type: UPDATE_TOOLTIP, data });
  }, [dispatch]);

  return { onSetTooltipClose, onSetTooltipTitle };
};
