/*
 * Owner: melon@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useKuxFormat, {NumberFormat, normalNumberFormat} from 'src/hooks/useKuxFormat';

jest.mock('@kufox/mui/hooks/useSnackbar', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

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
      categories: {},
    })),
  };
});

jest.mock('helper', () => {
  const originalModule = jest.requireActual('src/helper');
  return {
    __esModule: true,
    ...originalModule,
    default: null,
    getIsAndroid: jest.fn(() => true),
  };
});

describe('useKuxFormat In Android Func', () => {
  it('test useKuxFormat numberFormat ', () => {
    const { result } = renderHook(() => useKuxFormat());
    expect(result.current.numberFormat).toBeDefined();
    expect(
      result.current.numberFormat({
        number: 10000.324,
        needAbs: false,
        suitableForAndroid: true,
        options: {
          minimumFractionDigits: 2,
        },
      }),
    ).toEqual('10,000.32');
    expect(
      result.current.numberFormat({
        number: '0.000000001',
        needAbs: false,
        suitableForAndroid: true,
      }),
    ).toEqual('0.000000001');
    expect(
      result.current.numberFormat({
        number: 0.000000001,
        needAbs: false,
        suitableForAndroid: true,
      }),
    ).toEqual('0.000000001');
  });
  it('test useKuxFormat numberFormat use percent', () => {
    const { result } = renderHook(() => useKuxFormat());
    expect(
      result.current.numberFormat({
        number: 10.32457,
        needAbs: false,
        suitableForAndroid: true,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('1,032.46%');
    expect(
      result.current.numberFormat({
        number: '10.1200',
        needAbs: false,
        suitableForAndroid: true,
        isPositive: false,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('1,012.00%');
    expect(
      result.current.numberFormat({
        number: 0.2000,
        needAbs: false,
        suitableForAndroid: true,
        isPositive: false,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('20.00%');
    expect(
      result.current.numberFormat({
        number: 30.0000,
        needAbs: false,
        suitableForAndroid: true,
        isPositive: false,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('3,000.00%');
    expect(
      result.current.numberFormat({
        number: '0.3000',
        needAbs: false,
        suitableForAndroid: true,
        isPositive: false,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('30.00%');
  });

  it('test useKuxFormat numberFormat use percent when number < 0', () => {
    const { result } = renderHook(() => useKuxFormat());
    expect(
      result.current.numberFormat({
        number: '-11.32457',
        needAbs: false,
        suitableForAndroid: true,
        isPositive: false,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('-1,132.46%');
    expect(
      result.current.numberFormat({
        number: '-50.1200',
        needAbs: false,
        suitableForAndroid: true,
        isPositive: false,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('-5,012.00%');
  });

  it('test useKuxFormat numberFormat use percent when isPositive is true', () => {
    const { result } = renderHook(() => useKuxFormat());
    expect(
      result.current.numberFormat({
        number: 12.32457,
        needAbs: false,
        suitableForAndroid: true,
        isPositive: true,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('+1,232.46%');
    expect(
      result.current.numberFormat({
        number: 104.324,
        lang: 'ar_AE',
        isPositive: true,
        suitableForAndroid: true,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toBeDefined();
  });
});
