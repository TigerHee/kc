/**
 * owner@clyne@kupotech.com
 */
import React, { FC, useReducer, useContext, Dispatch } from 'react';
import { AppState, AppAction } from 'futures/types/contract';
import { ThemeProvider } from '@kux/mui';
import { FuturesContext, DispatchContext } from './config';
import { reducer } from './reducer';
import { DEFAULT_THEME } from '../../constant';

// 定义初始状态
const initialState: AppState = {
  theme: '',
  symbolsMap: {},
};

const FuturesProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <ThemeProvider theme={state.theme || DEFAULT_THEME}>
        <FuturesContext.Provider value={state}>{children}</FuturesContext.Provider>
      </ThemeProvider>
    </DispatchContext.Provider>
  );
};

// 创建类型安全的自定义hook
export const useFuturesSelector = (): AppState => {
  const context = useContext(FuturesContext);
  if (context === undefined) {
    throw new Error('useStateValue must be used within a StateProvider');
  }
  return context;
};

export const useFuturesDispatch = (): Dispatch<AppAction> => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useDispatch must be used within a StateProvider');
  }
  return context;
};

export default React.memo(FuturesProvider);
