/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-18 11:25:20
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-22 15:05:22
 */
import React, {createContext, memo, useContext, useReducer} from 'react';

import {MY_COPY_RENDER_ITEM_TYPE} from '../../constant';

export const MyCopiesContext = createContext();

const initialState = {
  //  任务提示去报名弹窗
  renderCardType: MY_COPY_RENDER_ITEM_TYPE.myPositionCurrent,
  filterValuesMap: {},
  isClosedWaitConfirmCopyConfigIdMap: {},
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'asyncRenderCardType': {
      const {payload: renderCardType} = action;
      return {...state, renderCardType};
    }
    case 'setFilterValues': {
      const {payload: values} = action;
      const {filterValuesMap, renderCardType} = state;
      return {
        ...state,
        filterValuesMap: {
          ...filterValuesMap,
          [renderCardType]: values,
        },
      };
    }

    case 'addClosedWaitConfirmCopyConfigId': {
      const {payload: copyConfigId} = action;
      const {isClosedWaitConfirmCopyConfigIdMap} = state || {};
      return {
        ...state,
        isClosedWaitConfirmCopyConfigIdMap: {
          ...isClosedWaitConfirmCopyConfigIdMap,
          [copyConfigId]: true,
        },
      };
    }

    default:
      console.error('SlotDetailContext error reducer type');
      return state;
  }
};

export const MyCopiesProviderContainer = memo(({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MyCopiesContext.Provider value={{state, dispatch}}>
      {children}
    </MyCopiesContext.Provider>
  );
});

export const useStore = () => {
  const store = useContext(MyCopiesContext);
  if (store === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};
