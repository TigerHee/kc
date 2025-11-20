// createStoreProvider.ts
import React, { createContext, useContext, ReactNode, useMemo, useEffect, useRef } from 'react';
import { useInitialProps } from 'provider/InitialProvider';
import { useStore, StoreApi, UseBoundStore } from 'zustand';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

// 为 React 17 及以下版本添加 polyfill
if (!React.useSyncExternalStore) {
  React.useSyncExternalStore = useSyncExternalStore;
}

export default function createStoreProvider<S>(
  storeName: string,
  createStoreFn: (initialState: Partial<S>) => UseBoundStore<StoreApi<S>>,
  defaultState?: any
) {
  const StoreContext = createContext<UseBoundStore<StoreApi<S>> | null>(null);

  const StoreProvider = ({
    children,
    initialState = {} as Partial<S>,
  }: {
    children: ReactNode;
    initialState?: Partial<S>;
  }) => {
    const pageProps = useInitialProps();
    const storeRef = useRef<UseBoundStore<StoreApi<S>> | null>(null);

    // eslint-disable-next-line prototype-pollution/no-bracket-notation-property-accessor
    const storeData = useMemo(() => pageProps?.[storeName] || {}, [pageProps?.[storeName]]);

    const store = useMemo(() => {
      const newStore = createStoreFn({ ...initialState, ...storeData });
      storeRef.current = newStore;

      return newStore;
    }, [storeData]);

    useEffect(() => {
      if (storeRef.current && storeData && Object.keys(storeData).length > 0) {
        const storeApi = storeRef.current.getState();

        // 检查是否有新的状态需要同步
        const hasNewState = Object.entries(storeData).some(([key, value]) => {
          // 只更新未初始化的状态或与当前状态不同的值
          return storeApi[key as keyof S] === undefined || storeApi[key as keyof S] !== value;
        });

        if (hasNewState) {
          // 使用 setState 更新状态，保持现有状态不变
          storeRef.current.setState(state => {
            let mergedState: S;

            // 完全覆盖策略
            mergedState = { ...state, ...storeData };

            return mergedState;
          });

          // 调试信息
          console.log(`[${storeName}] Store state synchronized with new data:`, storeData);
        }
      }
    }, [storeData, storeName]);

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
  };

  const useStoreValue = <U,>(selector: (store: S) => U): U | undefined => {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error(
        `useStoreValue must be used within ${storeName}Provider. ` +
        `Make sure you have wrapped your component with ${storeName}Provider.`
      );
    }
    // return useStore(store, selector);
    return useStore(store, state => {
      if (!state) {
        return selector(defaultState || {});
      }
      return selector(state);
    });
  };

  return { StoreProvider, useStoreValue };
}
