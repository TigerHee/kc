/**
 * Owner: larvide.peng@kupotech.com
 */
import { useRestrictNotice } from 'src/hooks/useRestrictNotice';
import { renderHook } from '@testing-library/react-hooks';

const state = {
  ['$header_header']: {
    isShowRestrictNotice: true,
    restrictNoticeHeight: 100,
  },
};
jest.mock('react-redux', () => {
  const originalModule = jest.requireActual('react-redux');
  return {
    __esModule: true,
    ...originalModule,
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn((cb) => cb(state)),
  };
});

test('test useRestrictNotice', () => {
  const { result } = renderHook(() => useRestrictNotice());

  expect(result.current.restrictNoticeHeight).toBe(100);
  expect(result.current.isShowRestrictNotice).toBe(true);
});
