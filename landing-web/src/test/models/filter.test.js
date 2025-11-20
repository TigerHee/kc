/*
 * Owner: jesse.shao@kupotech.com
 */
import model from 'src/utils/common_models/filter.js';

describe('model', () => {
  describe('reducers', () => {
    describe('updateFilters', () => {
      it('should update filters with payload', () => {
        const state = { filters: {} };
        const action = { type: 'updateFilters', payload: { foo: 'bar' } };
        const newState = model.reducers.updateFilters(state, action);
        expect(newState.filters).toEqual({ foo: 'bar' });
      });

      it('should update filters with default values', () => {
        const state = { filters: {} };
        const action = { type: 'updateFilters' };
        const newState = model.reducers.updateFilters(state, action);
        expect(newState.filters).toEqual({});
      });

      it('should override filters if specified', () => {
        const state = { filters: { foo: 'bar' } };
        const action = { type: 'updateFilters', payload: { baz: 'qux' }, override: true };
        const newState = model.reducers.updateFilters(state, action);
        expect(newState.filters).toEqual({ baz: 'qux' });
      });

      it('should not override filters by default', () => {
        const state = { filters: { foo: 'bar' } };
        const action = { type: 'updateFilters', payload: { baz: 'qux' } };
        const newState = model.reducers.updateFilters(state, action);
        expect(newState.filters).toEqual({ foo: 'bar', baz: 'qux' });
      });
    });
  });

  describe('effects', () => {
    describe('filter', () => {
      it('should call updateFilters and effect', () => {
        const payload = { foo: 'bar' };
        const action = { type: 'filter', payload, override: true };
        const put = jest.fn();
        const gen = model.effects.filter(action, { put });
        expect(gen.next().value).toEqual(put({ type: 'updateFilters', payload, override: true }));
        expect(gen.next().value).toEqual(put({ type: 'query' }));
        expect(gen.next().done).toBe(true);
      });

      it('should not call effect if effect is false', () => {
        const payload = { foo: 'bar' };
        const action = { type: 'filter', payload, effect: false };
        const put = jest.fn();
        const gen = model.effects.filter(action, { put });
        expect(gen.next().value).toEqual(put({ type: 'updateFilters', payload, override: false }));
        expect(gen.next().done).toBe(true);
      });
    });
  });
});
