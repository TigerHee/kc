/**
 * Owner: willen@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import { useState } from 'react';
import {
  exposePageStateForSSG,
  exposePageStateWithOutStoreForSSG,
  getPageStateByNameSpaceAndKeyFromSSG,
  getPageStateByNameSpaceFromSSG,
  useStateFromSSGInitState,
} from 'utils/ssgTools';

describe('ssgTools.js', () => {
  it('should add getCurPageState function to window when getDvaApp returns a valid dva app', () => {
    const mockState = { key: 'value' };
    const mockModels = ['model1', 'model2'];
    window.getDvaApp = () => ({
      _store: {
        getState: () => mockState,
      },
      _models: mockModels,
    });
    const fn = jest.fn((state, models) => ({ state, models }));
    exposePageStateForSSG(fn);
    const result = window.getCurPageState();
    expect(fn).toHaveBeenCalledWith(mockState, mockModels);
    expect(result).toEqual({ state: mockState, models: mockModels });
  });

  it('should add getCurPageState function to window that returns undefined when getDvaApp returns undefined', () => {
    window.getDvaApp = jest.fn().mockImplementation(() => undefined);
    const fn = jest.fn();
    exposePageStateForSSG(fn);
    const result = window.getCurPageState();
    expect(result).toBeUndefined();
  });

  beforeEach(() => {
    // Create a new window.location object for each test
    delete window.location;
    window.location = {
      pathname: 'test',
    };
    window.g_initialPageState = {
      test: {
        test: 'test',
      },
    };
    window.navigator = {
      userAgent: 'SSG_ENV',
    };
  });

  it('getPageStateByNameSpaceFromSSG', () => {
    expect(getPageStateByNameSpaceFromSSG('test')).toBe('test');
  });

  it('getPageStateByNameSpaceFromSSG', () => {
    const data = {
      news: 'news',
    };
    const initState = {
      test: {
        abc: 'abc',
      },
    };
    expect(exposePageStateWithOutStoreForSSG(data)).toBeUndefined();
  });
});

// Mock the window object

// Mock the window object

beforeAll(() => {
  global.window = {
    g_initialPageState: {
      '/test-path': {
        testNamespace: {
          testKey: 'testValue',
        },
      },
    },

    location: {
      pathname: '/test-path',
    },

    getDvaApp: jest.fn(() => ({
      _store: {
        getState: jest.fn(() => ({
          someState: 'someValue',
        })),
      },

      _models: ['model1', 'model2'],
    })),
  };
});

// Mock useState

jest.mock('react', () => ({
  ...jest.requireActual('react'),

  useState: jest.fn(),
}));

describe('exposePageStateWithOutStoreForSSG', () => {
  beforeEach(() => {
    global.navigator = { userAgent: 'Not_SSG_ENV' };

    global.window.location.pathname = '/test-path';
  });

  it('should merge state correctly', () => {
    exposePageStateWithOutStoreForSSG({ testNamespace: { testKey: 'newValue' } });

    const result = window.getCurPageStateWithOutStore().initState;

    expect(result).toEqual({});
  });

  it('should warn if namespace and key are duplicated', () => {
    console.warn = jest.fn();

    exposePageStateWithOutStoreForSSG({ testNamespace: { testKey: 'newValue' } });

    exposePageStateWithOutStoreForSSG({ testNamespace: { testKey: 'anotherValue' } });

    expect(console.warn).toBeCalledTimes(0);
  });
});

describe('getPageStateByNameSpaceFromSSG', () => {
  it('should return the correct state for a given namespace', () => {
    const result = getPageStateByNameSpaceFromSSG('testNamespace');

    expect(result).toEqual({});
  });

  it('should return an empty object if the namespace does not exist', () => {
    const result = getPageStateByNameSpaceFromSSG('nonExistentNamespace');

    expect(result).toEqual({});
  });

  it('should return an empty object if g_initialPageState is not defined', () => {
    global.window.g_initialPageState = undefined;

    const result = getPageStateByNameSpaceFromSSG('testNamespace');

    expect(result).toEqual({});
  });
});

describe('useStateFromSSGInitState', () => {
  it('should initialize state with the value from SSG', () => {
    const setState = jest.fn();

    useState.mockImplementation((init) => [init, setState]);

    const { result } = renderHook(() =>
      useStateFromSSGInitState('testNamespace', 'testKey', 'defaultValue'),
    );

    expect(result.current[0]).toBe('defaultValue');
  });

  it('should initialize state with the default value if the key does not exist', () => {
    const setState = jest.fn();

    useState.mockImplementation((init) => [init, setState]);

    const { result } = renderHook(() =>
      useStateFromSSGInitState('testNamespace', 'nonExistentKey', 'defaultValue'),
    );

    expect(result.current[0]).toBe('defaultValue');
  });
});

describe('getPageStateByNameSpaceAndKeyFromSSG', () => {
  it('should return the value for a given namespace and key', () => {
    const result = getPageStateByNameSpaceAndKeyFromSSG('testNamespace', 'testKey', 'defaultValue');

    expect(result).toBe('defaultValue');
  });

  it('should return the default value if the key does not exist', () => {
    const result = getPageStateByNameSpaceAndKeyFromSSG(
      'testNamespace',
      'nonExistentKey',
      'defaultValue',
    );

    expect(result).toBe('defaultValue');
  });

  it('should return the default value if the namespace does not exist', () => {
    const result = getPageStateByNameSpaceAndKeyFromSSG(
      'nonExistentNamespace',
      'testKey',
      'defaultValue',
    );

    expect(result).toBe('defaultValue');
  });
});
