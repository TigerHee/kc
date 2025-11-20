import React from 'react';
import { render, cleanup } from '@testing-library/react';
import lottie from 'lottie-web';
import LottieProvider from 'src/trade4.0/components/LottieProvider/index.js';

// Mock the lottie-web module
jest.mock('lottie-web', () => ({
  loadAnimation: jest.fn(() => ({
    destroy: jest.fn(),
    setSpeed: jest.fn(),
  })),
}));

afterEach(cleanup);

describe('LottieProvider', () => {
  it('renders without crashing', () => {
    const lottieJson = undefined;
    const { container } = render(<LottieProvider lottieJson={lottieJson} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('calls lottie.loadAnimation with correct parameters', () => {
    const lottieJson = {};
    render(<LottieProvider lottieJson={lottieJson} loop={false} />);
    expect(lottie.loadAnimation).toHaveBeenCalledWith({
      loop: false,
      container: expect.anything(),
      renderer: 'svg',
      autoplay: true,
      animationData: lottieJson,
    });
  });
});
