import {getInitialParams} from 'utils/init-router-helper';

describe('init-router-helper.js', () => {
  describe('getInitialParams', () => {
    it('should parse router string with query parameters', () => {
      const initRouter = 'test-route?param1=value1&param2=value2';
      const result = getInitialParams(initRouter);

      expect(result).toEqual({
        name: 'test-route',
        query: 'param1=value1&param2=value2',
        params: {
          param1: 'value1',
          param2: 'value2',
        },
      });
    });

    it('should handle URL encoded characters', () => {
      const initRouter = 'test-route?param1=value%201&param2=value%202';
      const result = getInitialParams(initRouter);

      expect(result).toEqual({
        name: 'test-route',
        query: 'param1=value 1&param2=value 2',
        params: {
          param1: 'value 1',
          param2: 'value 2',
        },
      });
    });

    it('should handle router string without query parameters', () => {
      const initRouter = 'test-route';
      const result = getInitialParams(initRouter);

      expect(result).toEqual({
        name: 'test-route',
        query: undefined,
        params: {},
      });
    });

    it('should handle empty router string', () => {
      const initRouter = '';
      const result = getInitialParams(initRouter);

      expect(result).toEqual({
        name: '',
        query: undefined,
        params: {},
      });
    });

    it('should handle complex query parameters', () => {
      const initRouter = 'test-route?array[]=1&array[]=2&object[key]=value';
      const result = getInitialParams(initRouter);

      expect(result).toEqual({
        name: 'test-route',
        query: 'array[]=1&array[]=2&object[key]=value',
        params: {
          array: ['1', '2'],
          object: {
            key: 'value',
          },
        },
      });
    });
  });
});
