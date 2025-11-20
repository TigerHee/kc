/*
 * @Owner: Melon@kupotech.com
 * @Author: Melon Melon@kupotech.com
 * @Date: 2025-05-26 11:08:48
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-05-26 11:08:55
 * @FilePath: /kucoin-main-web/src/components/common/DialogStore.js
 * @Description:
 *
 *
 */

import React, { createContext, useContext, useMemo, useCallback, useReducer } from 'react';

/**
 * @typedef {object} CloseDialogOptions
 * @property {boolean} retainContext 是否保留context，默认`false`不保留，即重置为`undefined`
 *
 * @typedef {object} DialogStore
 * @property {boolean} visible
 * @property {unknown} context
 * @property {React.Dispatch<unknown>} setContext
 * @property {(context: unknown) => void} openDialog
 * @property {(options?: CloseDialogOptions) => void} closeDialog
 *
 * @typedef {object} DialogState
 * @property {boolean} visible
 * @property {unknown} context
 */

/**
 * @param {DialogState} state
 * @param {DialogState} payload
 */
const reducer = (state, payload) => {
  return { ...state, ...payload };
};

/**
 * 创建一个控制 Dialog 显隐的store
 * @returns {[useDialogStore: () => DialogStore, DialogProvider: import('react').Provider<DialogStore>]}
 */
export function createDialogStore() {
  const DialogContext = createContext();

  const useDialogStore = () => {
    const store = useContext(DialogContext);
    if (!store) {
      throw new Error('useDialogStore must be used within a DialogProvider');
    }
    return store;
  };

  const DialogProvider = ({ children }) => {
    // 改用`useReducer，使`visible` & `context`的状态更新合并为一个原子操作，避免宏任务场景两者状态被分批更新
    const [state, update] = useReducer(reducer, { visible: false, context: undefined });
    const { visible, context } = state;

    const setContext = useCallback((context) => {
      update({ context });
    }, []);

    const openDialog = useCallback((context) => {
      update({ visible: true, context });
    }, []);

    const closeDialog = useCallback(({ retainContext } = { retainContext: false }) => {
      if (!retainContext) {
        update({ visible: false, context: undefined });
      } else {
        update({ visible: false });
      }
    }, []);

    const store = useMemo(() => {
      return {
        visible,
        context,
        setContext,
        openDialog,
        closeDialog,
      };
    }, [visible, context, openDialog, closeDialog]);

    return <DialogContext.Provider value={store}>{children}</DialogContext.Provider>;
  };

  return [useDialogStore, DialogProvider];
}
