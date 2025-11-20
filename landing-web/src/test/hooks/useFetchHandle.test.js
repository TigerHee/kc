/**
 * Owner: jesse@kupotech.com
 */

import useFetchHandle from 'src/hooks/useFetchHandle';
import { renderHook } from '@testing-library/react-hooks';

import useSnackbar from '@kufox/mui/hooks/useSnackbar';

import { fetchHandle } from 'utils/request';

jest.mock('@kufox/mui/hooks/useSnackbar');

jest.mock('utils/request');

describe('test useFetchHandle', () => {
  test('with normal useSnackbar', () => {
    useSnackbar.mockReturnValue({ message: {} });

    const { result } = renderHook(() => useFetchHandle());

    result.current({ response: {} }, { conf: {} });
    expect(fetchHandle).toHaveBeenCalledWith({ response: {} }, { conf: {}, message: {} });
  });

  test('with abnormal useSnackbar', () => {
    useSnackbar.mockReturnValue(undefined);

    const { result } = renderHook(() => useFetchHandle());

    result.current({ response: {} }, { conf: {} });
    expect(fetchHandle).toHaveBeenCalledWith({ response: {} }, { conf: {}, message: {} });
  });
});
