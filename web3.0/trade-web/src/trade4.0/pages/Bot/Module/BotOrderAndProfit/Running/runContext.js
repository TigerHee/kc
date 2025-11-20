/**
 * Owner: mike@kupotech.com
 */
import React, { createContext, useContext } from 'react';

const WrapperRunContext = createContext({});
const WrapperHistoryContext = createContext({});

export const RunProvider = ({ value, children }) => {
  return <WrapperRunContext.Provider value={value}>{children}</WrapperRunContext.Provider>;
};
export const HistoryProvider = ({ value, children }) => {
  return <WrapperHistoryContext.Provider value={value}>{children}</WrapperHistoryContext.Provider>;
};

export const useRunContext = () => {
  return useContext(WrapperRunContext)?.current;
};

export const useHistoryContext = () => {
  return useContext(WrapperHistoryContext)?.current;
};
