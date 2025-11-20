/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-05 23:49:52
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-04-05 23:59:35
 * @FilePath: /trade-web/_tests_/hooks/useLoginDrawer.test.js
 * @Description: 
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';

import { Provider } from 'react-redux';

import { createStore } from 'redux';

import useLoginDrawer from 'src/trade4.0/hooks/useLoginDrawer.js'; // path to your hook


jest.mock('@kux/mui', () => ({
  useTheme: jest.fn(),
}));
// Mock your trackClick function

jest.mock('utils/ga', () => ({

  trackClick: jest.fn(),

}));



// Mock your reducer

const reducer = (state = { user: { isLogin: false }, app: { open: false } }, action) => {

  switch (action.type) {

    case 'app/update':

      return { ...state, app: { open: action.payload.open } };

    default:

      return state;

  }

};



describe('useLoginDrawer', () => {

  it('should dispatch action on open', () => {

    const store = createStore(reducer);

    const { result } = renderHook(() => useLoginDrawer(), {

      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,

    });



    act(() => {

      result.current.open();

    });



    expect(store.getState().app.open).toBe(true);

    //expect(trackClick).toHaveBeenCalledWith(['login', '1']);

  });



  it('should return isLogin state', () => {

    const store = createStore(reducer);

    const { result } = renderHook(() => useLoginDrawer(), {

      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,

    });



    expect(result.current.isLogin).toBe(false);

  });

});