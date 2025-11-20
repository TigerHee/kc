/**
 * owner@clyne@kupotech.com
 */
import { SymbolsMap, AppState } from 'futures/types/contract';
import { Context, createContext, Dispatch } from 'react';

/**
 * 主题context
 */
export const FuturesContext = createContext<AppState | undefined>(undefined);

/**
 * 合约配置context
 */
export const FuturesSymbolsMapContext: Context<SymbolsMap> = createContext({});

// 定义action类型
type AppAction = { type: 'UPDATE'; payload: SymbolsMap };

export const DispatchContext = createContext<Dispatch<AppAction> | undefined>(undefined);
