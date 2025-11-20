import * as echarts from 'echarts/core';

import {convertPxToReal} from 'utils/computedPx';
import {
  convertChartPx,
  generateLineVisualMap,
  getPnlGradient,
} from 'utils/echart-helper';

// Mock dependencies
jest.mock('echarts/core', () => ({
  graphic: {
    LinearGradient: jest.fn(),
  },
}));

jest.mock('utils/computedPx', () => ({
  convertPxToReal: jest.fn(value => value * 2),
}));

describe('echart-helper.js', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('getPnlGradient', () => {
    it('should create gradient for positive values', () => {
      const param = {
        max: 100,
        min: 50,
        light: true,
        cstyle: true,
      };

      getPnlGradient(param);

      expect(echarts.graphic.LinearGradient).toHaveBeenCalledWith(0, 0, 0, 1, [
        {
          offset: 0,
          color: 'green',
        },
        {
          offset: 1,
          color: '#FFF',
        },
      ]);
    });

    it('should create gradient for negative values', () => {
      const param = {
        max: -50,
        min: -100,
        light: false,
        cstyle: false,
      };

      getPnlGradient(param);

      expect(echarts.graphic.LinearGradient).toHaveBeenCalledWith(0, 1, 0, 0, [
        {
          offset: 1,
          color: '#1A1A1A',
        },
        {
          offset: 0,
          color: 'green',
        },
      ]);
    });

    it('should create gradient for mixed values', () => {
      const param = {
        max: 100,
        min: -50,
        light: true,
        cstyle: true,
      };

      getPnlGradient(param);

      expect(echarts.graphic.LinearGradient).toHaveBeenCalledWith(0, 0, 0, 1, [
        {
          offset: 0,
          color: 'green',
        },
        {
          offset: 0.6666666666666666, // max / (max - min)
          color: '#FFF',
        },
        {
          offset: 1,
          color: 'red',
        },
      ]);
    });
  });

  describe('convertChartPx', () => {
    it('should convert pixels using convertPxToReal', () => {
      const result = convertChartPx(100);
      expect(convertPxToReal).toHaveBeenCalledWith(100, false);
      expect(result).toBe(200);
    });
  });

  describe('generateLineVisualMap', () => {
    it('should generate visual map for non-zero values', () => {
      const params = {
        cstyle: true,
        green: 'green',
        red: 'red',
        isAllElementEqZero: false,
      };

      const result = generateLineVisualMap(params);

      expect(result).toEqual([
        {
          show: false,
          pieces: [
            {
              lt: 0,
              color: 'red',
            },
            {
              gte: 0,
              lt: 999999999,
              color: 'green',
            },
          ],
        },
      ]);
    });

    it('should generate visual map for all zero values', () => {
      const params = {
        cstyle: true,
        green: 'green',
        red: 'red',
        isAllElementEqZero: true,
      };

      const result = generateLineVisualMap(params);

      expect(result).toEqual([
        {
          show: false,
          pieces: [
            {
              gte: 0,
              lt: 999999999,
              color: 'green',
            },
          ],
        },
      ]);
    });

    it('should handle different color styles', () => {
      const params = {
        cstyle: false,
        green: 'green',
        red: 'red',
        isAllElementEqZero: false,
      };

      const result = generateLineVisualMap(params);

      expect(result).toEqual([
        {
          show: false,
          pieces: [
            {
              lt: 0,
              color: 'green',
            },
            {
              gte: 0,
              lt: 999999999,
              color: 'red',
            },
          ],
        },
      ]);
    });
  });
});
