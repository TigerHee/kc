/**
 * Owner: chris@kupotech.com
 */
import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import LottieProvider from 'components/LottieProvider';
import { customRender } from '../setup';

jest.mock('lottie-web', () => ({
  loadAnimation: jest.fn().mockReturnValue({
    setSpeed: jest.fn(),
    playSegments: jest.fn(),
    destroy: jest.fn(),
  }),
}));

describe('LottieProvider', () => {
  beforeAll(() => {
    global.fetch = jest.fn(
      () =>
        new Promise((resolve, reject) => {
          resolve({
            json: () => ({}),
          });
        }),
    );
    global.__webpack_public_path__ = '';
    global.DEPLOY_PATH = '';
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('loads new animation data when iconName changes', async () => {
    const { rerender } = customRender(<LottieProvider iconName="initial" />);
    rerender(<LottieProvider iconName="new" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${__webpack_public_path__}${DEPLOY_PATH}/static/lottie/new.json`,
      );
    });
  });

  test('sets loop and segments correctly', async () => {
    const { rerender } = customRender(
      <LottieProvider iconName="test" loop={false} segments={[10, 20]} />,
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const instance = require('lottie-web').loadAnimation.mock.results[0].value;
    expect(instance.playSegments).toHaveBeenCalledWith([10, 20], false);
  });

  test('sets speed correctly', async () => {
    customRender(<LottieProvider iconName="test" speed={0.5} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const instance = require('lottie-web').loadAnimation.mock.results[0].value;
    expect(instance.setSpeed).toHaveBeenCalledWith(0.5);
  });
});
