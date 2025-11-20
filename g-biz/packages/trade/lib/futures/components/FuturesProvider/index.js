/**
 * owner@clyne@kupotech.com
 */
import React, { useReducer, useContext } from 'react';
import { ThemeProvider } from '@kux/mui';
import { FuturesContext, DispatchContext } from './config';
import { reducer } from './reducer';
import { DEFAULT_THEME } from '../../constant';
// 定义初始状态
const initialState = {
    theme: '',
    symbolsMap: {},
};
const FuturesProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (React.createElement(DispatchContext.Provider, { value: dispatch },
        React.createElement(ThemeProvider, { theme: state.theme || DEFAULT_THEME },
            React.createElement(FuturesContext.Provider, { value: state }, children))));
};
// 创建类型安全的自定义hook
export const useFuturesSelector = () => {
    const context = useContext(FuturesContext);
    if (context === undefined) {
        throw new Error('useStateValue must be used within a StateProvider');
    }
    return context;
};
export const useFuturesDispatch = () => {
    const context = useContext(DispatchContext);
    if (context === undefined) {
        throw new Error('useDispatch must be used within a StateProvider');
    }
    return context;
};
export default React.memo(FuturesProvider);
