/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-18 11:25:20
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-22 15:05:22
 */
import { createContext, useReducer } from 'react';
import { PROJECT_ACTIVITY_STATUS } from '../../constant';
import { getActivityStatus } from './presenter';

export const SlotDetailContext = createContext();

const noop = () => {};

const initialState = {
  projectDetail: {},
  activityStatus: PROJECT_ACTIVITY_STATUS.activityNotStarted,
  refreshProjectDetail: noop,
  //  任务提示去报名弹窗
  enrollConfirmPromptVisible: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'updateProjectDetail':
      const { payload: projectDetail } = action;
      const activityStatus = getActivityStatus(projectDetail);
      return { ...state, projectDetail, activityStatus };

    case 'registerRefreshProjectDetail':
      const { payload: fnc } = action;
      return { ...state, refreshProjectDetail: fnc };

    case 'destroyRefreshProjectDetail':
      return { ...state, refreshProjectDetail: noop };

    case 'toggleEnrollPromptDialog':
      return { ...state, enrollConfirmPromptVisible: !state.enrollConfirmPromptVisible };

    default:
      console.error('SlotDetailContext error reducer type');
      return state;
  }
};

export const SlotDetailProviderContainer = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <SlotDetailContext.Provider value={{ state, dispatch }}>{children}</SlotDetailContext.Provider>
  );
};

export * from './useStore';
