/**
 * tank@clyne@kupotech.com
 */
import { AppState, AppAction } from 'futures/types/contract';

export const UPDATE = 'UPDATE';

export const SET_THEME = 'SET_THEME';

// 定义reducer函数
export const reducer = (state: AppState, action: AppAction): AppState => {
  const { payload } = action;
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};
