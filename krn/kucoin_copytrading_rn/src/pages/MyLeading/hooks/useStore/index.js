/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-18 11:25:20
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-22 15:05:22
 */
import React, {createContext, useContext, useReducer} from 'react';

import {MY_LEADING_RENDER_ITEM_TYPE} from '../../constant';

export const MyLeadingContext = createContext();

const initialState = {
  //  任务提示去报名弹窗
  renderCardType: MY_LEADING_RENDER_ITEM_TYPE.myPositionCurrent,
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'asyncRenderCardType':
      const {payload: renderCardType} = action;
      return {...state, renderCardType};

    default:
      console.error('SlotDetailContext error reducer type');
      return state;
  }
};

export const MyLeadingProviderContainer = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <MyLeadingContext.Provider value={{state, dispatch}}>
      {children}
    </MyLeadingContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(MyLeadingContext);
  if (store === undefined) {
    console.error('useStore must be used within a StoreProvider');
  }
  return store;
};
