/*
 * Owner: jesse.shao@kupotech.com
 */
import model from 'src/utils/common_models/sort.js';
import { put } from 'redux-saga/effects';

describe('reducers', () => {
  describe('updateSorter', () => {
    const { updateSorter } = model.reducers;

    it('should update sorter', () => {
      const state = { sorter: null };
      const action = { payload: { field: 'name', order: 'ascend' } };
      const expected = { sorter: { field: 'name', order: 'ascend' } };
      expect(updateSorter(state, action)).toEqual(expected);
    });

    it('should override sorter if override flag is true', () => {
      const state = { sorter: { field: 'age', order: 'descend' } };
      const action = {
        payload: { field: 'name', order: 'ascend' },
        override: true,
      };
      const expected = { sorter: { field: 'name', order: 'ascend' } };
      expect(updateSorter(state, action)).toEqual(expected);
    });

    it('should set sorter to null if override flag is true and payload is null', () => {
      const state = { sorter: { field: 'age', order: 'descend' } };
      const action = { payload: null, override: true };
      const expected = { sorter: {} };
      expect(updateSorter(state, action)).toEqual(expected);
    });
  });
});

describe('effects', () => {
  describe('sort', () => {
    const { sort } = model.effects;

    it('should dispatch updateSorter and query', () => {
      const action = { payload: { field: 'name', order: 'ascend' } };
      const gen = sort(action, { put });

      expect(gen.next().value).toEqual(
        put({
          ...action,
          type: 'updateSorter',
        }),
      );

      expect(gen.next().value).toEqual(put({ type: 'query' }));

      expect(gen.next().done).toBe(true);
    });
  });
});
