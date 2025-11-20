/*
 * Owner: jesse.shao@kupotech.com
 */
import model from 'src/utils/common_models/mulPagination.js';

describe('model', () => {
  describe('reducers', () => {
    describe('mulPagination', () => {
      it('should update filters with payload', () => {
        const state = { filters: {} };
        const action = { type: 'clearPage', payload: {} };
        const newState = model.reducers.clearPage(state, action);
        expect(newState).toEqual({ filters: {}, pagination: false, records: [] });
      });

      it('should update filters with payload2', () => {
        const state = { records: [], pagination: false };
        const action = { type: 'clearPage', payload: { listName: 'a' } };
        const newState = model.reducers.clearPage(state, action);
        expect(newState).toEqual({ pagination: false, records: [] });
      });

      it('should update filters with payload3', () => {
        const state = { records: [], pagination: false };
        const action = { type: 'savePage', payload: { listName: 'a', currentPage: 11 } };
        const newState = model.reducers.clearPage(state, action);
        expect(newState).toEqual({ pagination: false, records: [] });
      });
    });
  });
});
