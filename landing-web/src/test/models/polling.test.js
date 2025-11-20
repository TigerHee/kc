/*
 * Owner: jesse.shao@kupotech.com
 */
import { take, put, race, call, fork, cancel, cancelled } from 'redux-saga/effects';
import polling from 'src/utils/common_models/polling.js';

describe('countDown', () => {
  // it('should call watchPolling and effect', () => {
  //   const payload = { countKey: 'bar' };
  //   const action = { type: 'a/filter', payload, override: true };
  //   const put = jest.fn();
  //   const gen = watchPolling.effects.watchPolling(action, { put });
  //   expect(gen.next().done).toBe(true);
  // });

  it('should call polling and effect', () => {
    const payload = { initial: 601, step: 12, interval: 10001, countKey: 'bar' };
    const action = { type: 'a/filter', payload, override: true };
    // const put = jest.fn();
    // const call = jest.fn();
    // const take = jest.fn();
    // const select = jest.fn();
    // const race = jest.fn().mockResolvedValue({});
    // const race = jest.fn(() => ({ stop: false }));

    // const gen = polling.effects.watchPolling(action, {
    //   take,
    //   put,
    //   race,
    //   call,
    //   fork,
    //   cancel,
    //   cancelled,
    // });
    // // expect(gen.next().value).toEqual({ stop: false });
    // gen.next();
    // gen.next();
    // gen.next();
  });
});
