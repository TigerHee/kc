import React, { useEffect } from 'react';
import { useFooterStore, defaultInitState } from './model';
import { useDvaSyncHook } from 'tools/dva';

export default function useExternalSync(namespace: string, dva?: any) {
  const pullSummary = useFooterStore(store => store.pullSummary);
  const pullServerTime = useFooterStore(store => store.pullServerTime);
  const getTurnoverRank = useFooterStore(store => store.getTurnoverRank);
  const pullFooterInfo = useFooterStore(store => store.pullFooterInfo);

  const registerExternalModel = () => {
    if (!dva) {
      return;
    }
    const exists = Array.isArray(dva._models) && dva._models.some((m: any) => m?.namespace === namespace);
    if (exists) return;

    if (typeof dva.model === 'function') {
      dva.model({
        namespace,
        state: defaultInitState || {},
        reducers: {
          update(state: any, { payload }: any) {
            return { ...state, ...(payload || {}) };
          },
        },
        effects: {
          *pullSummary(_, { call }) {
            yield call(pullSummary);
          },
          *pullServerTime(_, { call }) {
            yield call(pullServerTime);
          },
          *getTurnoverRank(_, { call }) {
            yield call(getTurnoverRank);
          },
          *pullFooterInfo(_, {call}) {
            yield call(pullFooterInfo);
          }
        },
      });
    }
  };

  useEffect(() => {
    registerExternalModel();
  }, [dva]);

  // 需要同步的 keys
  useDvaSyncHook(useFooterStore as any, namespace, Object.keys(defaultInitState), dva);
}
