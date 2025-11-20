/*
 * @owner: borden@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import { useRequest as useAhookRequest } from 'ahooks';
import { useDispatch } from 'react-redux';
import useRequest from 'src/hooks/useRequest.js'; // assuming the file is named useRequest.js

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('ahooks', () => ({
  useRequest: jest.fn(),
}));

jest.mock('src/plugins/showError', () => jest.fn());

describe('useRequest', () => {
  it('should handle request and error correctly', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    const mockService = jest.fn().mockResolvedValue('mocked response');
    const mockFormatResult = jest.fn((res) => res);
    const mockOnError = jest.fn();

    useAhookRequest.mockImplementation((serviceFunc, options) => {
      serviceFunc();
      options.onError('mocked error');
    });

    renderHook(() =>
      useRequest(mockService, { formatResult: mockFormatResult, onError: mockOnError }),
    );

    expect(mockService).toHaveBeenCalled();
    expect(mockFormatResult).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalledWith('mocked error', expect.any(Function));
  });
});
