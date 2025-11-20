/**
 * Owner: willen@kupotech.com
 */
import { push, back, replace } from 'src/utils/router';

describe('test router', () => {
  test('test router', async () => {
    expect(await push('/404')).toBe();
    expect(await replace('/404')).toBe();
  });

  test('test router', async () => {
    expect(await push('https://www.kucoin.com/')).toBe();
    expect(await back('https://www.kucoin.com/')).toBe();
    expect(await replace('https://www.kucoin.com/')).toBe();
  });

  test('test router', async () => {
    expect(await push('https://www.kucoin.com/acc')).toBe();
    expect(await back('https://www.kucoin.com/')).toBe();
    expect(await replace('https://www.kucoin.com/')).toBe();
  });
});
