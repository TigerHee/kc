/*
 * Owner: jesse.shao@kupotech.com
 */
import model from 'src/utils/common_models/paginate.js';

describe('model', () => {
  it('should handle savePage reducer', () => {
    const state = {
      records: [],
      pagination: false,
    };
    const payload = {
      items: [
        { id: 1, name: 'item1' },
        { id: 2, name: 'item2' },
      ],
      totalNum: 2,
      currentPage: 1,
      page: 1,
      pageSize: 10,
    };
    const action = {
      type: 'model/savePage',
      payload,
    };
    const expectedState = {
      pagination: {
        total: 2,
        current: 1,
        pageSize: 10,
      },
      records: [
        { id: 1, name: 'item1' },
        { id: 2, name: 'item2' },
      ],
    };

    expect(model.reducers.savePage(state, action)).toEqual(expectedState);
  });
});
