/**
 * Owner: solar@kupotech.com
 */
import React from 'react';
import { customRender } from 'test/setup';
import CoinPrecision from 'src/components/common/CoinPrecision/index.js';

describe('CoinPrecision', () => {
  const coinDict = {
    BTC: { precision: 2 },
    ETH: { precision: 3 },
  };

  //   it('should render correct value with precision', () => {
  //     const { getByText } = customRender(
  //       <CoinPrecision coin="BTC" value={123.4567} coinDict={coinDict} />,
  //     );
  //     expect(getByText('123.46')).toBeInTheDocument();
  //   });

  it('should render correct value without precision if coin not in coinDict', () => {
    const { getByText } = customRender(
      <CoinPrecision coin="LTC" value={123.4567} coinDict={coinDict} />,
    );
    expect(getByText('123.4567')).toBeInTheDocument();
  });

  //   it('should render correct value with fillZero', () => {
  //     const { getByText } = customRender(
  //       <CoinPrecision coin="BTC" value={123.4} coinDict={coinDict} fillZero />,
  //     );
  //     expect(getByText('123.40')).toBeInTheDocument();
  //   });

  it('should render correct value with fixZero', () => {
    const { getByText } = customRender(
      <CoinPrecision coin="BTC" value={123.0} coinDict={coinDict} fixZero />,
    );
    expect(getByText('123')).toBeInTheDocument();
  });
});
