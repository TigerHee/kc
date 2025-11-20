/*
 * Owner: melon@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useKuxFormat, {numberFormat, NumberFormat, normalNumberFormat} from 'src/hooks/useKuxFormat';
import { useSelector } from 'dva';

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
  const originalModule = jest.requireActual('src/helper.js');
  return {
    __esModule: true,
    ...originalModule,
    default: null,
    getIsAndroid: jest.fn(() => false),
  };
});

describe('useKuxFormat Func', () => {
  afterEach(() => {
    useSelector.mockClear();
  });
  it('test useKuxFormat', () => {
    const { result } = renderHook(() => useKuxFormat());
    expect(result.current.dateTimeFormat).toBeDefined();
    expect(result.current.numberFormat).toBeDefined();
    expect(result.current.NumberFormat).toBeDefined();
  });

  it('test dateTimeFormat fun', () => {

    const mockState = {
      app: {
        currentLang: 'en_US',
      }
    }
    useSelector.mockImplementation((selector) => selector(mockState));
    const { result } = renderHook(() => useKuxFormat());
    expect(
      result.current.dateTimeFormat({
        date: '2023/01/01',
        options: {
          hour: undefined,
          minute: undefined,
          second: undefined,
        },
      }),
    ).toBeDefined();
  });

  it('test numberFormat fun', () => {
    const { result } = renderHook(() => useKuxFormat());
    expect(
      result.current.numberFormat({
        number: 10000.324,
        options: {
          minimumFractionDigits: 2,
        },
      }),
    ).toEqual('10,000.324');
    expect(
      result.current.numberFormat({
        number: 1.3245,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('132.45%');
    expect(
      result.current.numberFormat({
        number: 10000.324,
        needAbs: false,
        options: {
          minimumFractionDigits: 2,
        },
      }),
    ).toEqual('10,000.324');
  });

  it('test numberFormat fun when number is null', () => {
    const { result } = renderHook(() => useKuxFormat());
    expect(
      result.current.numberFormat({
        number: null,
      }),
    ).toEqual('--');
  });

  it('test numberFormat fun when number is null && defaultText is kucoin', () => {
    const { result } = renderHook(() => useKuxFormat());
    expect(
      result.current.numberFormat({
        number: null,
        defaultText: 'kucoin'
      }),
    ).toEqual('kucoin');
  });


  it('test NumberFormat fun', () => {
    const { result } = renderHook(() => useKuxFormat());
    expect(
      result.current.NumberFormat({
        number: 10.32467,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('1,032.467%');
    expect(
      result.current.NumberFormat({
        number: 100.324,
        lang: 'ar_AE',
        options: {
          minimumFractionDigits: 2,
        },
      }),
    ).toBeDefined();
    expect(
      result.current.NumberFormat({
        number: 100.324,
        lang: 'ar_AE',
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toBeDefined();
  });

  it('test NumberFormat when typeof number is number ', () => {
    expect(
      NumberFormat({
        number: 12.32457,
        isPositive: true,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('+1,232.457%');
    expect(
      NumberFormat({
        number: 13.32457,
        isPositive: true,
        options: {
          maximumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('+1,332.46%');
    expect(
      NumberFormat({
        number: 0.1400,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('14.00%');
    expect(
      NumberFormat({
        number: -15.32457,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('-1,532.457%');
    expect(
      NumberFormat({
        number: 0.0002,
      }),
    ).toEqual('0.0002');
    expect(
      NumberFormat({
        number: 0.000000001,
      }),
    ).toEqual('0.000000001');
    expect(
      NumberFormat({
        number: 0.0000000000001,
      }),
    ).toEqual('0.0000000000001');
  });

  it('test NumberFormat when typeof number is string ', () => {
    expect(
      NumberFormat({
        number: '22.32457',
        isPositive: true,
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('+2,232.457%');
    expect(
      NumberFormat({
        number: '23.32457',
        isPositive: true,
        options: {
          maximumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('+2,332.46%');
    expect(
      NumberFormat({
        number:'0.2400',
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('24.00%');
    expect(
      NumberFormat({
        number: '-25.32457',
        options: {
          minimumFractionDigits: 2,
          style: 'percent',
        },
      }),
    ).toEqual('-2,532.457%');
    expect(
      NumberFormat({
        number: '0.0002',
      }),
    ).toEqual('0.0002');
    expect(
      NumberFormat({
        number: '0.000000001',
      }),
    ).toEqual('0.000000001');
    expect(
      NumberFormat({
        number: '0.000000001',
        isPositive: true,
      }),
    ).toEqual('+0.000000001');
    expect(
      NumberFormat({
        number: '-0.000000001',
      }),
    ).toEqual('-0.000000001');
  });

  it('test normalNumberFormat when typeof number is number ', () => {
    expect(
      normalNumberFormat({
        number: 32324.576,
        isPositive: true,
        options: {
          style: 'percent',
        },
      }),
    ).toEqual('+32,324.576%');
    expect(
      normalNumberFormat({
        number: 33.32457,
        isPositive: true,
        options: {
          style: 'percent',
        },
      }),
    ).toEqual('+33.32457%');
    expect(
      normalNumberFormat({
        number: 34.32457,
        isPositive: true,
        options: {
          style: 'percent',
        },
      }),
    ).toEqual('+34.32457%');
    expect(
      normalNumberFormat({
        number: 35.00,
        options: {
          style: 'percent',
        },
      }),
    ).toEqual('35%');
    expect(
      normalNumberFormat({
        number: -36.32457,
        options: {
          style: 'percent',
        },
      }),
    ).toEqual('-36.32457%');
    expect(
      normalNumberFormat({
        number: 0.0002,
      }),
    ).toEqual('0.0002');
    expect(
      normalNumberFormat({
        number: 0.000000001,
      }),
    ).toEqual('0.000000001');
    expect(
      normalNumberFormat({
        number: 0.0000000000001,
      }),
    ).toEqual('0.0000000000001');
  });

  it('test normalNumberFormat when typeof number is string ', () => {
    expect(
      normalNumberFormat({
        number: '42324.576',
        isPositive: true,
        options: {
          style: 'percent',
        },
      }),
    ).toEqual('+42,324.576%');
    expect(
      normalNumberFormat({
        number: '43.32457',
        isPositive: true,
        options: {
          style: 'percent',
        },
      }),
    ).toEqual('+43.32457%');
    expect(
      normalNumberFormat({
        number: '44.32457',
        isPositive: true,
        options: {
          style: 'percent',
        },
      }),
    ).toEqual('+44.32457%');
    expect(
      normalNumberFormat({
        number:'45.00',
        options: {
          style: 'percent',
        },
      }),
    ).toEqual('45.00%');
    expect(
      normalNumberFormat({
        number: '-46.32457',
        options: {
          style: 'percent',
        },
      }),
    ).toEqual('-46.32457%');
    expect(
      normalNumberFormat({
        number: '0.0002',
      }),
    ).toEqual('0.0002');
    expect(
      normalNumberFormat({
        number: '0.000000001',
      }),
    ).toEqual('0.000000001');
    expect(
      normalNumberFormat({
        number: '0.000000001',
        isPositive: true,
      }),
    ).toEqual('+0.000000001');
    expect(
      normalNumberFormat({
        number: '-0.000000001',
      }),
    ).toEqual('-0.000000001');
  });

});
