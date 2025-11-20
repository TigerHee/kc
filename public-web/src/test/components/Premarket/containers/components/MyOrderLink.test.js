/**
 * Owner: june.lee@kupotech.com
 */
import '@testing-library/jest-dom/extend-expect';
import { MyOrderLink } from 'src/components/Premarket/containers/components/MyOrderLink';
import { customRender } from 'src/test/setup.js';

import JsBridge from '@knb/native-bridge';

const { isApp, open } = JsBridge;

describe('test MyOrderLink', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('test MyOrderLink in app', () => {
    isApp.mockReturnValue(true);
    customRender(<MyOrderLink />);
  });
  it('test MyOrderLink', () => {
    isApp.mockReturnValue(false);
    customRender(<MyOrderLink />);
  });
});
