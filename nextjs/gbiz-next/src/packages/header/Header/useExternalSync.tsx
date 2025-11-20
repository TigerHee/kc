import React, { useEffect } from 'react';
import { useHeaderStore, defaultHeaderState } from './model';
import { useDvaSyncHook } from 'tools/dva';

export default function useExternalSync(namespace: string, dva?: any) {
  const pullKCSRights = useHeaderStore(store => store.pullKCSRights);
  const logout = useHeaderStore(store => store.logout);
  const getKycStatusDisplayInfo = useHeaderStore(store => store.getKycStatusDisplayInfo);

  const registerExternalModel = () => {
    if (!dva) {
      return;
    }
    const exists = Array.isArray(dva._models) && dva._models.some((m: any) => m?.namespace === namespace);
    if (exists) return;

    if (typeof dva.model === 'function') {
      dva.model({
        namespace,
        state: defaultHeaderState || {},
        reducers: {
          update(state: any, { payload }: any) {
            return { ...state, ...(payload || {}) };
          },
        },
        effects: {
          *pullKCSRights(_, { call }) {
            yield call(pullKCSRights);
          },
          *logout({ payload }, { call }) {
            yield call(logout, payload || {})
          },
          *getKycStatusDisplayInfo(_, { call }) {
            yield call(getKycStatusDisplayInfo)
          }
        },
      });
    }
  };

  useEffect(() => {
    registerExternalModel();
  }, [dva]);

  // 需要同步的 keys
  useDvaSyncHook(useHeaderStore as any, namespace, Object.keys(defaultHeaderState), dva);
}
