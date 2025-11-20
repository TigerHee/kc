import React from 'react';
import '@testing-library/jest-dom'
import { cleanup, } from "@testing-library/react";
import { renderWithTheme } from '_tests_/test-setup';
import CoinCurrency from 'src/components/common/CoinCurrency';

afterEach(cleanup);

test('test CoinCurrency', () => {
  const { wrapper, rerenderWithTheme } = renderWithTheme(<CoinCurrency coin='BTC' value={100.32}/>)
  const { container, debug } = wrapper;
  expect(container).toHaveTextContent('≈ 2,246,027.13');
  rerenderWithTheme(<CoinCurrency coin='BTC' value={100.32} showType={2} />)
  expect(container).not.toHaveTextContent('≈');
  expect(container).toHaveTextContent('2,246,027.13');
});
