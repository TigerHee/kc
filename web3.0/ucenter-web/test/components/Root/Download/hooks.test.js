import { act, renderHook } from '@testing-library/react-hooks';
import useModalsAndBanners from 'src/components/Root/Download/hooks/useModalsAndBanners';
import storage from 'src/utils/storage'

describe('useModalsAndBanners hook', () => {
  test('should return true for canShowModal when there is no previous data', () => {
    const { result } = renderHook(() => useModalsAndBanners());
    expect(result.current.canShowModal).toBe(true);
  });

  test('should update localStorage and calculate closeTimes correctly', () => {
    const { result } = renderHook(() => useModalsAndBanners());

    act(() => {
      result.current.modalUpdateDataFn();
    });

    let data = storage.getItem('download_modal_data');
    expect(data.closeTimes).toBe(1);

    act(() => {
      result.current.modalUpdateDataFn();
    });

    data = storage.getItem('download_modal_data');
    expect(data.closeTimes).toBe(2);
  });

  test('should return false for canShowModal if modal has been closed once within 7 days', () => {
    const { result } = renderHook(() => useModalsAndBanners());

    act(() => {
      result.current.modalUpdateDataFn();
    });

    const { result: newResult } = renderHook(() => useModalsAndBanners());
    expect(newResult.current.canShowModal).toBe(false);
  });

  test('should return true for canShowModal if modal has not been closed in the last 7 days', () => {
    const { result } = renderHook(() => useModalsAndBanners());

    act(() => {
      result.current.modalUpdateDataFn();
    });

    // Simulate passing of 8 days
    const data = storage.getItem('download_modal_data');
    data.time = Date.now() - 8 * 24 * 60 * 60 * 1000;
    storage.setItem('download_modal_data', data);

    const { result: newResult } = renderHook(() => useModalsAndBanners());
    expect(newResult.current.canShowModal).toBe(true);
  });
});
