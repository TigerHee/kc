/**
 * Owner: willen@kupotech.com
 */
const { default: useTwitterAds } = require('src/hooks/useTwitterAds');
import { renderHook } from '@testing-library/react-hooks';

jest.mock('utils/loadScript', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({}),
}));

test('test useTwitterAds', async () => {
  window.twttr = { conversion: { trackPid: jest.fn() } };
  renderHook(useTwitterAds);
  await new Promise((resolve) =>
    setTimeout(() => {
      window.twttr = null;
      renderHook(useTwitterAds);
      resolve();
    }, 50),
  );
  await new Promise((resolve) =>
    setTimeout(() => {
      Object.defineProperty(navigator, 'userAgent', { value: 'Test SSG_ENV', configurable: true });
      renderHook(useTwitterAds);
      resolve();
    }, 50),
  );
});
