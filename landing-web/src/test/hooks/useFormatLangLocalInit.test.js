/*
 * Owner: melon@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useFormatLangLocalInit from 'src/hooks/useFormatLangLocalInit';
jest.mock('dva', () => {
  return {
    __esModule: true,
    default: null,
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn(() => ({
      app: {
        currentLang: 'en_US',
      },
      user: {},
    })),
  };
});

describe('useFormatLangLocalInit Func', () => {
  it('test useFormatLangLocalInit', () => {
    const { result } = renderHook(() => useFormatLangLocalInit());
    expect(result.current.formatLangNumber).toBeDefined();
    expect(result.current.formatLangDate).toBeDefined();
    expect(result.current.formatLangNumber({
      data:  0.258789, lang: 'bn-BD', options:{ style: 'percent' }
    })).toEqual('২৫.৮৭৮৯%');
    expect(result.current.formatLangDate({
      data: 1707523200000, lang: 'bn-BD',
    })).toBeDefined();
  });
});
