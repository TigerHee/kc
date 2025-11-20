/*
 * Owner: melon@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useKuCurrency from 'src/hooks/useKuCurrency';

jest.mock('@kufox/mui/hooks/useSnackbar', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

jest.mock('react-redux', () => ({
  connect: jest.fn((com) => {
    return (com2) => {
      return () =>
        com2({
          coinDict: {
            a: {
              precision: 100,
            },
            coin: 'a',
          },
        });
    };
  }),
  useSelector: jest.fn(() => {}),
}));

jest.mock('dva', () => {
  return {
    __esModule: true,
    default: null,
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn(() => ({
      app: {},
      user: {},
      categories: {},
    })),
  };
});

describe('useKuCurrency Func', () => {
  it('test useKuCurrency', () => {
    const { result } = renderHook(() => useKuCurrency());
    expect(result.current.getKuCoin).toBeDefined();
    expect(result.current.getKuCoinValByKey).toBeDefined();
    expect(result.current.getKuCoin()).toBeDefined();
    expect(result.current.getKuCoinValByKey()).toBeDefined();
  });
});
