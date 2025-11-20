/**
 * Owner: willen@kupotech.com
 */
import { compose } from 'src/utils/ga';

jest.mock('tools/ext/kc-sensors', () => {
  return {
    __esModule: true,
    default: {
      spm: {
        getSiteId: () => null,
        getPageId: () => null,
      },
    },
  };
});

describe('test compose', () => {
  test('test compose', () => {
    expect(compose()).toBe('');
  });
});
