/**
 * Owner: tiger@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import { kycStatusEnum } from 'src/routes/AccountPage/Kyc/KycHome/site/TH/constants/index.js';
import useKyc3Status from 'src/routes/AccountPage/Kyc/KycHome/site/TH/hooks/useKyc3Status';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('useKyc3Status hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty string when user is not logged in', () => {
    useSelector.mockImplementation((selector) =>
      selector({ user: { isLogin: false }, kyc_th: { kycInfo: {} } }),
    );

    const { result } = renderHook(() => useKyc3Status());
    expect(result.current.kyc3Status).toBe('');
  });

  it('should return KYC_VERIFIED when kycType is KYC and kycVerifyStatus is 1', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { isLogin: true },
        kyc_th: {
          kycInfo: { kycType: 'KYC', kycVerifyStatus: 1 },
        },
      }),
    );

    const { result } = renderHook(() => useKyc3Status());
    expect(result.current.kyc3Status).toBe(kycStatusEnum.KYC_VERIFIED);
  });

  it('should return UNVERIFIED when kycProcessStatus is -1', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { isLogin: true },
        kyc_th: {
          kycInfo: { kycType: 'KYC', kycVerifyStatus: 0, kycProcessStatus: -1 },
        },
      }),
    );

    const { result } = renderHook(() => useKyc3Status());
    expect(result.current.kyc3Status).toBe(kycStatusEnum.UNVERIFIED);
  });

  it('should return KYC_VERIFYING when kycProcessStatus is 0', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { isLogin: true },
        kyc_th: {
          kycInfo: { kycType: 'KYC', kycVerifyStatus: 0, kycProcessStatus: 0 },
        },
      }),
    );

    const { result } = renderHook(() => useKyc3Status());
    expect(result.current.kyc3Status).toBe(kycStatusEnum.KYC_VERIFYING);
  });

  it('should return KYC_REJECTED when kycProcessStatus is 1', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { isLogin: true },
        kyc_th: {
          kycInfo: { kycType: 'KYC', kycVerifyStatus: 0, kycProcessStatus: 1 },
        },
      }),
    );

    const { result } = renderHook(() => useKyc3Status());
    expect(result.current.kyc3Status).toBe(kycStatusEnum.KYC_REJECTED);
  });

  it('should return KYB_VERIFIED when kycType is KYB and kybVerifyStatus is 1', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { isLogin: true },
        kyc_th: {
          kycInfo: { kycType: 'KYB', kybVerifyStatus: 1 },
        },
      }),
    );

    const { result } = renderHook(() => useKyc3Status());
    expect(result.current.kyc3Status).toBe(kycStatusEnum.KYB_VERIFIED);
  });

  it('should return KYB_VERIFIED when kycType is KYB and kybProcessStatus is -1', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { isLogin: true },
        kyc_th: {
          kycInfo: { kycType: 'KYB', kybVerifyStatus: 0, kybProcessStatus: -1 },
        },
      }),
    );

    const { result } = renderHook(() => useKyc3Status());
    expect(result.current.kyc3Status).toBe(kycStatusEnum.UNVERIFIED);
  });

  it('should return KYB_VERIFIED when kycType is KYB and kybProcessStatus is 0', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { isLogin: true },
        kyc_th: {
          kycInfo: { kycType: 'KYB', kybVerifyStatus: 0, kybProcessStatus: 0 },
        },
      }),
    );

    const { result } = renderHook(() => useKyc3Status());
    expect(result.current.kyc3Status).toBe(kycStatusEnum.KYB_VERIFYING);
  });

  it('should return KYB_VERIFIED when kycType is KYB and kybProcessStatus is 1', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { isLogin: true },
        kyc_th: {
          kycInfo: { kycType: 'KYB', kybVerifyStatus: 0, kybProcessStatus: 1 },
        },
      }),
    );

    const { result } = renderHook(() => useKyc3Status());
    expect(result.current.kyc3Status).toBe(kycStatusEnum.KYB_REJECTED);
  });

  it('useKyc3Status advance VERIFIED', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { isLogin: true },
        kyc_th: {
          advanceStatusData: { advanceStatus: 1 },
        },
      }),
    );

    renderHook(useKyc3Status);
  });

  it('useKyc3Status advance REJECTED', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { isLogin: true },
        kyc_th: {
          advanceStatusData: { advanceStatus: 0, status: 9 },
        },
      }),
    );

    renderHook(useKyc3Status);
  });

  it('useKyc3Status advance VERIFYING', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { isLogin: true },
        kyc_th: {
          advanceStatusData: { advanceStatus: 0, status: 0 },
        },
      }),
    );

    renderHook(useKyc3Status);
  });
});
