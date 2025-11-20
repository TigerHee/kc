/*
 * Owner: terry@kupotech.com
 */

import baseModel from 'utils/common_models/base';

describe('utils/common_models/base', () => {

  it('update', () => {
    const state = {
      a: 1
    };
    const payload = {
      b: 2
    }
    const action = {
      type: 'model/update',
      payload,
    };
    const expectedState = {
      a: 1,
      b: 2,
    }
    expect(baseModel.reducers.update(state, action)).toEqual(expectedState);
  });

  it('reset', () => {
    const state = {
      a: 1
    };
    const payload = {
      b: 2
    }
    const action = {
      type: 'model/update',
      payload,
    };
    const expectedState = {
      b: 2,
    }
    expect(baseModel.reducers.reset(state, action)).toEqual(expectedState);
  });
})
