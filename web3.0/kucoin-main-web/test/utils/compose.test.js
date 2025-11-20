/**
 * Owner: willen@kupotech.com
 */
import { compose, getAnonymousID, addSpmIntoQuery, getPageId } from 'src/utils/ga';

jest.mock('tools/ext/kc-sensors', () => {
  return {
    __esModule: true,
    default: null,
  };
});

describe('test compose', () => {
  test('test compose', () => {
    expect(compose()).toBe('');
  });

  test('test getAnonymousID', () => {
    expect(getAnonymousID()).toBe('');
  });

  test('test addSpmIntoQuery', () => {
    expect(addSpmIntoQuery(null, {})).toBe(null);
  });
});
