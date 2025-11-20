/**
 * owner@clyne@kupotech.com
 */
import { ThemeProvider } from '@kux/mui-next';
import { AppAction, AppState } from 'packages/trade/futures/types/contract';
import React, { Dispatch, FC, useContext, useReducer } from 'react';
import { DEFAULT_THEME } from '../../constant';
import { DispatchContext, FuturesContext } from './config';
import { reducer } from './reducer';
import { useTranslation } from 'tools/i18n';

// 定义初始状态
export const initialState: AppState = {
  theme: '',
  symbolsMap: {},
  _t: () => '',
};



const FuturesProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation('trade');
  initialState._t = t;
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
