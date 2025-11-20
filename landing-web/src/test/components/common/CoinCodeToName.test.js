/*
 * @Owner: terry@kupotech.com
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CoinCodeToName from 'src/components/common/CoinCodeToName/index.js';

jest.mock('dva', () => ({
  connect: jest.fn((props2) => {
    return (com2) => {
      return (props) =>
        com2({
          coinDict: {
            BTC: { currencyName: 'Bitcoin' },
            ETH: { currencyName: 'Ethereum' },
          },
          ...(props || {}),
          ...(props2 || {})
        });
    };
  }),
}));

describe('CoinCodeToName', () => {

  it('should render the currency name if coin exists in coinDict', () => {
    const { getByText } = render(
      <CoinCodeToName coin="BTC" />
    );
  });

  it('should render the coin code if coin does not exist in coinDict', () => {
    const { getByText } = render(
      <CoinCodeToName coin="XRP" />
    );
  });
});