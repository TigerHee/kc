/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-05 23:49:52
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-04-06 00:07:35
 * @FilePath: /trade-web/_tests_/hooks/useEtfCoin.test.js
 * @Description: 
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';

import { Provider } from 'react-redux';

import { createStore } from 'redux';

import useEtfCoin from 'src/utils/hooks/useEtfCoin.js'; // path to your hook


jest.mock('@kux/mui', () => ({
  useTheme: jest.fn(),
}));
// Mock your trackClick function

jest.mock('utils/ga', () => ({

  trackClick: jest.fn(),

}));

// Mock your reducer

const reducer = (state = { trade: { currentSymbol: '' }, symbols: { symbolsMap: {} } }, action) => {

  // Implement your reducer logic here

  return state;

};



describe('useEtfCoin', () => {

  it('should return undefined when symbol type is not MARGIN_FUND', () => {

    const store = createStore(reducer);

    const { result } = renderHook(() => useEtfCoin('BTC-USDTT'), {

      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,

    });



    expect(result.current).toBeUndefined();

  });



  it('should return the base coin when symbol type is MARGIN_FUND', () => {

    const store = createStore((state = { trade: { currentSymbol: '' }, symbols: { symbolsMap: { 'BTC-USDT': { type: 'MARGIN_FUND' } } } }, action) => {

      // Implement your reducer logic here

      return state;

    });

    const { result } = renderHook(() => useEtfCoin('BTC-USDT'), {

      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,

    });



    expect(result.current).toBe('BTC');

  });

});