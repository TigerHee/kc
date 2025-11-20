/**
 * Owner: tiger@kupotech.com
 */
import {
  filterParams,
  kycSeniorSubmit,
  onValuesChange,
  resetRenderSequence,
} from 'src/components/Account/Kyc/common/components/CommonFunctions';

describe('test CommonFunctions', () => {
  const dispatch = (e) =>
    Promise.resolve({
      success: true,
    });
  test('test kycSeniorSubmit', async () => {
    const values = 'test';
    const onSuccessCallback = jest.fn();
    const onError = jest.fn();
    await kycSeniorSubmit({
      values,
      dispatch,
      onSuccessCallback,
      onError,
      service: 'submitKycCompMoreImg',
    });

    Object.defineProperty(navigator, 'userAgent', { value: 'Mobile Safari', writable: true });

    await kycSeniorSubmit({
      values,
      dispatch: (e) =>
        Promise.resolve({
          success: false,
          msg: 'err',
        }),
      onSuccessCallback,
      onError,
      service: 'kycCompBasicSubmit',
    });

    expect(onSuccessCallback).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  test('test filterParams', () => {
    expect(filterParams({ a: '123', b: '', c: '33' })).toEqual({ a: '123', c: '33' });
  });

  test('test resetRenderSequence', () => {
    expect(resetRenderSequence()).toEqual();
  });

  test('test onValuesChange', () => {
    expect(onValuesChange({})).toEqual();
    expect(onValuesChange({})).toEqual();
    expect(onValuesChange({ dispatch, failureReason: {} }, { a: 123 })).toEqual();
    expect(onValuesChange({ dispatch, failureReason: {} }, { name: 123 })).toEqual();
  });
});
