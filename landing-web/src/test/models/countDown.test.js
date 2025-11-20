/*
 * Owner: jesse.shao@kupotech.com
 */
import countDown from 'src/utils/common_models/countDown.js';

describe('countDown', () => {
  it('should call countDownClear and effect', () => {
    const payload = { countKey: 'bar' };
    const action = { type: 'a/filter', payload, override: true };
    const put = jest.fn();
    const gen = countDown.effects.countDownClear(action, { put });
    expect(gen.next().done).toBe(true);
  });

  it('should call countDownClear and effect', () => {
    const payload = { initial: 601, step: 12, interval: 10001, countKey: 'bar' };
    const action = { type: 'a/filter', payload, override: true };
    const put = jest.fn();
    const call = jest.fn();
    const take = jest.fn();
    const select = jest.fn();
    const race = jest.fn(() => ({
      stop: false,
    }));
    const gen = countDown.effects.countDown(action, { put, race, select, call, take });
    expect(gen.next().value).toEqual(
      put({
        type: 'update',
        payload: {
          bar: 60,
        },
      }),
    );
  });
});
