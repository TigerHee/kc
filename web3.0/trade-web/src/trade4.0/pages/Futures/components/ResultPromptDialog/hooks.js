/**
 * Owner: garuda@kupotech.com
 */
import { useState, useCallback, useEffect, useMemo } from 'react';

import { useTheme } from '@kux/mui/hooks';

import { useDispatch, useSelector } from 'dva';

import { evtEmitter } from 'helper';

import { RESULT_PROMPT_EVENT } from './config';

const event = evtEmitter.getEvt();

// 异常弹框初始化
export const useResultPromptInit = () => {
  const dispatch = useDispatch();
  const onOperatorDialog = useCallback(
    (params) => {
      dispatch({ type: 'futuresCommon/update', payload: { resultPromptInfo: params } });
    },
    [dispatch],
  );

  useEffect(() => {
    event.on(RESULT_PROMPT_EVENT, onOperatorDialog);
    return () => {
      event.off(RESULT_PROMPT_EVENT, onOperatorDialog);
    };
  }, [onOperatorDialog]);
};

// 返回颜色
export const useThemeIsDark = () => {
  const { currentTheme } = useTheme();

  const isDark = useMemo(() => currentTheme === 'dark', [currentTheme]);
  return isDark;
};

// 弹框需要的参数
export const useResultPromptProps = () => {
  const resultPromptInfo = useSelector((state) => state.futuresCommon.resultPromptInfo);

  return {
    resultPromptInfo,
  };
};

// 控制弹框
export const useOperatorResultPrompt = () => {
  const onCloseDialog = useCallback(() => {
    event.emit(RESULT_PROMPT_EVENT, false);
  }, []);

  const onOpenDialog = useCallback((params) => {
    event.emit(RESULT_PROMPT_EVENT, params);
  }, []);

  return {
    onCloseDialog,
    onOpenDialog,
  };
};
