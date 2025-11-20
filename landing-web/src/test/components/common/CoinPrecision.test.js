/*
 * @Owner: jesse.shao@kupotech.com
 */
// import CoinPrecision from '@kp-toc/anti-duplication';
import CoinPrecision from 'components/common/CoinPrecision';
import React, { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

jest.mock('react-redux', () => ({
  connect: jest.fn((com) => {
    return (com2) => {
      return () =>
        com2({
          coinDict: {
            a: {
              precision: 100,
            },
            coin: 'a',
          },
        });
    };
  }),
}));

describe('test CoinPrecision', () => {
  test('renders CoinPrecision component', () => {
    render(<CoinPrecision />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('renders CoinPrecision component', () => {
    render(<CoinPrecision fillZero />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('renders CoinPrecision component', () => {
    render(<CoinPrecision fillZero value={30} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('renders CoinPrecision component', () => {
    render(
      <CoinPrecision
        fillZero
        value={30}
        coin="a"
        coinDict={{
          a: {
            precision: 100,
          },
        }}
      />,
    );
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('renders CoinPrecision component', () => {
    render(
      <CoinPrecision
        value={30}
        coin="a"
        coinDict={{
          a: {
            precision: 100,
          },
        }}
      />,
    );
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
