import React from 'react';
import '@testing-library/jest-dom'
import { cleanup, } from "@testing-library/react";
import { renderWithTheme } from '_tests_/test-setup';
import CoinCodeToName from 'src/components/common/CoinCodeToName';

afterEach(cleanup);

test('test CoinCodeToName', () => {
  const { wrapper, rerenderWithTheme } = renderWithTheme(<CoinCodeToName coin={'USDT'}/>)
  const { container } = wrapper;
  expect(container).toHaveTextContent('USDT');
  rerenderWithTheme(<CoinCodeToName coin={'BTC'} />);
  expect(container).toHaveTextContent('BTC');
});
