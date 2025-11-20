import React from 'react';
import '@testing-library/jest-dom';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from '_tests_/test-setup';
import SymbolCodeToName from 'src/components/common/SymbolCodeToName';

afterEach(cleanup);

test('test SymbolCodeToName', () => {
  const { wrapper, rerenderWithTheme } = renderWithTheme(<SymbolCodeToName code={'BTC-USDT'} />);
  const { container } = wrapper;
  const symbols = [
    {
      code: 'ETH-USDT',
      symbol: 'ETH-USDT',
    },
  ];
  expect(container).toHaveTextContent('BTC/USDT');
  rerenderWithTheme(<SymbolCodeToName code={'ETH-USDT'} symbols={symbols} />);
  expect(container).toHaveTextContent('ETH/USDT');
});

test('test SymbolCodeToName dir', () => {
  const { wrapper, rerenderWithTheme } = renderWithTheme(
    <SymbolCodeToName dir="ltr" code={'BTC-USDT'} />,
  );
  const { container } = wrapper;
  const symbols = [
    {
      code: 'ETH-USDT',
      symbol: 'ETH-USDT',
    },
  ];
  expect(container).toHaveTextContent('BTC/USDT');
  rerenderWithTheme(<SymbolCodeToName dir="ltr" code={'ETH-USDT'} symbols={symbols} />);
  expect(container).toHaveTextContent('ETH/USDT');
});
