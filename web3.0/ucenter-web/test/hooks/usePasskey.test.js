/**
 * Owner: eli.xiang@kupotech.com
 */
// import { act } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import usePasskey, { PasskeyRegisterStatus } from 'src/hooks/usePasskey';
import { getPasskeyRegisterOptionsApi, passkeyRegisterApi } from 'src/services/ucenter/passkey';

// Mock the API functions
jest.mock('src/services/ucenter/passkey', () => ({
  getPasskeyRegisterOptionsApi: jest.fn(),
  passkeyRegisterApi: jest.fn(),
}));

describe('test usePasskey', async () => {
  // const { result } = renderHook(() => usePasskey());
  // expect(result.current).toEqual({
  //   currentPasskeyStatus: 1,
  //   loading: false,
  //   passkeyRegister: expect.any(Function),
  // });

  // await result.current.passkeyRegister();
  // expect(result.current.currentPasskeyStatus).toEqual(4);

  beforeEach(() => {
    jest.clearAllMocks(); // 清除所有 mock
  });

  it('should handle successful registration', async () => {
    // Mock API response
    const optionsRes = {
      success: true,
      code: '200',
      msg: 'success',
      retry: false,
      data: '{"publicKey":{"challenge":"E2zjqo1pKyPUCDGtGk5weaQ_G6W5Ybf9kW_xRVS1MOc","timeout":600000,"rpId":"kucoin.net","extensions":{}}}',
    };
    getPasskeyRegisterOptionsApi.mockResolvedValue(optionsRes);

    // Mock passkeyRegisterApi response
    const registerRes = {
      success: false,
      code: '500107',
      msg: 'passkey.options.expire.or.not.exist',
      retry: false,
      data: null,
    };
    passkeyRegisterApi.mockResolvedValue(registerRes);

    const { result, waitForNextUpdate } = renderHook(() => usePasskey());

    act(() => {
      result.current.passkeyRegister();
    });

    // Wait for loading state to change
    await waitForNextUpdate();

    expect(result.current.currentPasskeyStatus).toBe(PasskeyRegisterStatus.ERROR);
  });
});
