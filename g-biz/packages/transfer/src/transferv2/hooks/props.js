/**
 * Owner: solar@kupotech.com
 */
import React, { createContext, useContext, useMemo } from 'react';
import { DEFAULT_FIAT, DEFAULT_CURRENCY } from '../constants';

export const PropsContext = createContext();

export function useProps(selector = (state) => state) {
  return selector(useContext(PropsContext));
}

const EMPTY_FN = () => {};

export const PropsProvider = ({ value, children }) => {
  const _value = useMemo(() => {
    const { transferConfig, visible, reOpen, onClose, userInfo, currentLang, adaptUnified } = value;
    const { initDict = [], initCurrency: currency, callback, supportAccounts } = transferConfig;
    const [pay, rec] = initDict;

    return {
      fieldsDefault: {
        payAccountType: pay?.[0],
        recAccountType: rec?.[0],
        currency: currency || DEFAULT_CURRENCY,
        payTag: pay?.[1],
        recTag: rec?.[1],
      },
      supportAccounts,
      visible,
      reOpen: reOpen || EMPTY_FN,
      onClose: onClose || EMPTY_FN,
      successCallback: callback || EMPTY_FN,
      extInfo: {
        baseLegalCurrency: userInfo.currency || DEFAULT_FIAT,
      },
      currentLang,
      uid: userInfo.uid,
      isSub: userInfo.type === 3,
      adaptUnified: !!adaptUnified,
    };
  }, [value]);
  return <PropsContext.Provider value={_value}>{children}</PropsContext.Provider>;
};
