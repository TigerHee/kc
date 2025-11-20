import {create} from 'dva-core';

import {baseModel, dva} from 'utils/dva';

// Mock dependencies
jest.mock('dva-core', () => ({
  create: jest.fn(() => ({
    model: jest.fn(),
    use: jest.fn(),
    start: jest.fn(),
    _store: {
      getState: jest.fn(),
      dispatch: jest.fn(),
    },
  })),
}));

describe('dva.js', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('dva', () => {
    it('should create DVA instance with models', () => {
      const mockModel = {namespace: 'test'};
      const options = {
        models: [mockModel],
      };

      const app = dva(options);

      expect(create).toHaveBeenCalledWith(options);
      expect(app.model).toHaveBeenCalledWith(mockModel);
    });

    it('should create DVA instance with plugins', () => {
      const mockPlugin = {};
      const options = {
        plugins: [mockPlugin],
      };

      const app = dva(options);

      expect(create).toHaveBeenCalledWith(options);
      expect(app.use).toHaveBeenCalledWith(mockPlugin);
    });
  });

  describe('baseModel', () => {
    it('should have update reducer', () => {
      expect(baseModel.reducers).toHaveProperty('update');
    });

    it('should merge state with payload in update reducer', () => {
      const state = {a: 1, b: 2};
      const payload = {b: 3, c: 4};
      const result = baseModel.reducers.update(state, {payload});

      expect(result).toEqual({
        a: 1,
        b: 3,
        c: 4,
      });
    });

    it('should handle empty payload in update reducer', () => {
      const state = {a: 1, b: 2};
      const payload = {};
      const result = baseModel.reducers.update(state, {payload});

      expect(result).toEqual(state);
    });

    it('should handle null payload in update reducer', () => {
      const state = {a: 1, b: 2};
      const result = baseModel.reducers.update(state, {payload: null});

      expect(result).toEqual(state);
    });
  });
});
