/**
 * Owner: willen@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useUserPrompt from 'src/hooks/useUserPrompt';

jest.mock('react-redux', () => {
  const originalModule = jest.requireActual('react-redux');
  return {
    __esModule: true,
    ...originalModule,
    useDispatch: () =>
      jest
        .fn()
        .mockImplementation(() => Promise.resolve(['test']))
        .mockImplementation(() => Promise.resolve()),
    useSelector: jest.fn((cb) => cb({})),
  };
});

test('test useUserPrompt', () => {
  const { result } = renderHook(() =>
    useUserPrompt([
      ['TOTAL_ASSETS', 3],
      ['TOTAL_ASSETS_INNER', 1],
    ]),
  );
  result.current[1]('test');
  expect(result.current[0]).toEqual({ test: null });
});

test('test useUserPrompt', () => {
  const { result } = renderHook(() => useUserPrompt());
  expect(result.current[0]).toEqual({});
});
