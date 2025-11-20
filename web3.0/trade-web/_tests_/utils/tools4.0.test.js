/**
 * Owner: clyne@kupotech.com
 */

import { execMaybeFn, execMaybeFnOrParam, execOneFn } from 'src/trade4.0/utils/tools';

describe('tools 4.0 ', () => {
  test('execMaybeFn fn', () => {
    const fx = jest.fn();
    execMaybeFn(fx, 1, 2, 3);
    const ret = execMaybeFn('test', 1, 2, 3);
    expect(fx).toBeCalled();
    expect(ret).toBe('test');
  });

  test('execMaybeFnOrParam fn', () => {
    const fx = jest.fn();
    execMaybeFnOrParam(fx, 1, 2, 3);
    const ret = execMaybeFnOrParam('test', 1, 2, 3);
    expect(fx).toBeCalled();
    expect(ret).toBe(1);
  });

  test('execOneFn fn', () => {
    const fx1 = jest.fn();
    const fx2 = jest.fn();
    execOneFn(fx1, fx2, 2);
    expect(fx1).toBeCalled();
    execOneFn(null, fx2, 2);
    expect(fx2).toBeCalled();
  });
});
