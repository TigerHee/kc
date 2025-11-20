/**
 * Owner: melon@kupotech.com
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeProvider } from '@kux/mui/emotion';

import LottieProvider from 'src/components/LottieProvider/index';

// 模拟kux/mui theme
const theme = {
  colors: { text40: '#333333', primary: '#01BC8D', text: '#000D1D' },
  breakpoints: {
    down: () => {},
    up: () => {},
  },
};

jest.mock('lottie-web', () => {
  const defaultLottie = {
    play: jest.fn(),
    loadAnimation: () => {
      return {
        addEventListener: jest.fn(),
        destroy: jest.fn(),
        setSpeed: jest.fn(),
      }
    },
  }
  return {
    __esModule: true,
    default: defaultLottie,
  }
})

describe('LottieProvider', () => {
  // test('LottieProvider should in Document', () => {
  //   const onClickBack = jest.fn();
  //   const { container, baseElement } = render(
  //     <ThemeProvider onClickBack={onClickBack} theme={theme}>
  //       <LottieProvider className="kuCardLottieProvider" lottieJson={lottieJson} loop={true} speed={1000} />
  //     </ThemeProvider>,
  //   );
  //   expect(container).toBeInTheDocument();
  // });

  test('LottieProvider no json', () => {
    const onClickBack = jest.fn();
    const { container, baseElement } = render(
      <ThemeProvider onClickBack={onClickBack} theme={theme}>
        <LottieProvider className="kuCardLottieProvider" lottieJson={null} loop={true} />
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });
});
