/**
 * Owner: willen@kupotech.com
 */
const { default: useYandex } = require('src/hooks/useYandex');
import { renderHook } from '@testing-library/react-hooks';

jest.mock('utils/loadScript', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({}),
}));
test('test useYandex', () => {
  renderHook(useYandex);
});
