/*
 * owner: mike@kupotech.com
 */
import React, { useMemo, useCallback, useLayoutEffect } from 'react';
import useMergeState from 'Bot/hooks/useMergeState';

const createProvider =
  (ContextOfCreatePage, otherState = {}) =>
  ({ children, tab }) => {
    const [commonSetting, setCommonSetting] = useMergeState({
      fillAIParamsBtnActive: false, // 自定义填充ai参数按钮状态
      ...otherState,
    });
    const clearForm = useCallback((form, other = {}) => {
      form.resetFields();
      setCommonSetting({ fillAIParamsBtnActive: false, ...other });
    }, []);
    useLayoutEffect(() => {
      if (tab === 0) {
        setCommonSetting({ fillAIParamsBtnActive: false });
      }
    }, [tab]);
    const ctxData = useMemo(() => {
      return {
        commonSetting,
        setCommonSetting,
        clearForm,
      };
    }, [commonSetting]);

    return <ContextOfCreatePage.Provider value={ctxData}>{children}</ContextOfCreatePage.Provider>;
  };

export default createProvider;
