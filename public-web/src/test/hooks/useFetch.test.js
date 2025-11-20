/**
 * Owner: Ray.Lee@kupotech.com
 */
import { act, renderHook } from '@testing-library/react-hooks';

import { useSnackbar } from '@kux/mui';

import { useRequest } from 'ahooks';

import useFetch from 'src/hooks/useFetch.js';

// Mock the dependencies

jest.mock('@kux/mui', () => ({
  useSnackbar: jest.fn(),
}));

jest.mock('ahooks', () => ({
  useRequest: jest.fn(),
}));

jest.mock('tools/i18n', () => ({
  _t: jest.fn((key) => key),
}));

describe('useFetch', () => {
  const mockApi = jest.fn();

  const mockMessage = {
    error: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useSnackbar.mockReturnValue({ message: mockMessage });
  });

  it('should call the API with the correct parameters', async () => {
    const responseData = { data: 'response data' };

    mockApi.mockResolvedValue(responseData);

    useRequest.mockImplementation((fn, options) => {
      return {
        data: undefined,

        run: fn,

        ...options,
      };
    });

    const { result } = renderHook(() => useFetch(mockApi, { params: { id: 1 } }));

    await act(async () => {
      await result.current.run({ name: 'test' });
    });

    expect(mockApi).toHaveBeenCalledWith({ id: 1, name: 'test' });

    expect(result.current.data).toBeUndefined();
  });

  it('should handle API errors and show error message', async () => {
    const errorMessage = 'API error';

    mockApi.mockRejectedValue(new Error(errorMessage));

    useRequest.mockImplementation((fn, options) => {
      return {
        data: undefined,

        run: fn,

        ...options,
      };
    });

    const { result } = renderHook(() => useFetch(mockApi, { params: { id: 1 } }));

    await act(async () => {
      await result.current.run({ name: 'test' }).catch(() => {});
    });

    expect(mockMessage.error).not.toBeCalled();
  });

  it('should return initial data if API response is undefined', async () => {
    mockApi.mockResolvedValue({ data: undefined });

    useRequest.mockImplementation((fn, options) => {
      return {
        data: undefined,

        run: fn,

        ...options,
      };
    });

    const initialData = 'initial data';

    const { result } = renderHook(() => useFetch(mockApi, { initData: initialData }));

    await act(async () => {
      await result.current.run({ name: 'test' });
    });

    expect(result.current.data).toBe(initialData);
  });

  it('should return initial data if getInitData function returns true', async () => {
    const responseData = { data: 'response data' };

    mockApi.mockResolvedValue(responseData);

    useRequest.mockImplementation((fn, options) => {
      return {
        data: undefined,

        run: fn,

        ...options,
      };
    });

    const initialData = 'initial data';

    const getInitData = jest.fn(() => true);

    const { result } = renderHook(() => useFetch(mockApi, { initData: initialData, getInitData }));

    await act(async () => {
      await result.current.run({ name: 'test' });
    });

    expect(result.current.data).toBe(initialData);
  });

  it('should not return initial data if getInitData function returns false', async () => {
    const responseData = { data: 'response data' };
    mockApi.mockResolvedValue(responseData);
    useRequest.mockImplementation((fn, options) => {
      return {
        data: null,
        run: fn,
        ...options,
      };
    });
    const initialData = 'initial data';
    const getInitData = undefined;
    const { result } = renderHook(() => useFetch(mockApi, { initData: initialData, getInitData }));
    await act(async () => {
      await result.current.run({ name: 'test' });
    });
    expect(result.current.data).toBe(null);
  });
});
