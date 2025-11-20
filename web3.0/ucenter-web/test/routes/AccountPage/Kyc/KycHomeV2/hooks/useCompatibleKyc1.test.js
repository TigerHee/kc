/**
 * Owner: tiger@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import useCompatibleKyc1 from 'src/routes/AccountPage/Kyc/Home/hooks/useCompatibleKyc1';

const state = {
  user: {},
  kyc: {
    kycInfo: {},
    kycClearInfo: {},
  },
};

jest.mock('react-redux', () => {
  return {
    __esModule: true,
    default: null,
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn((cb) => cb(state)),
  };
});

test('test unverified', () => {
  useSelector.mockImplementation((selector) =>
    selector({
      kyc: {
        kycInfo: { verifyStatus: -1, primaryVerifyStatus: -1 },
        kycClearInfo: { clearStatus: -1 },
      },
    }),
  );
  const { rerender } = renderHook(useCompatibleKyc1);
  rerender();
});

test('test suspend', () => {
  useSelector.mockImplementation((selector) =>
    selector({
      kyc: {
        kycInfo: { verifyStatus: -1, primaryVerifyStatus: 1 },
        kycClearInfo: { clearStatus: -1 },
      },
    }),
  );
  const { rerender } = renderHook(useCompatibleKyc1);
  rerender();
});

test('test verifying', () => {
  useSelector.mockImplementation((selector) =>
    selector({
      kyc: {
        kycInfo: { verifyStatus: 0, primaryVerifyStatus: 1 },
        kycClearInfo: { clearStatus: -1 },
      },
    }),
  );
  const { rerender } = renderHook(useCompatibleKyc1);
  rerender();
});

test('test rejected', () => {
  useSelector.mockImplementation((selector) =>
    selector({
      kyc: {
        kycInfo: { verifyStatus: 2, primaryVerifyStatus: 1 },
        kycClearInfo: { clearStatus: -1 },
      },
    }),
  );
  const { rerender } = renderHook(useCompatibleKyc1);
  rerender();
});

test('test verified', () => {
  useSelector.mockImplementation((selector) =>
    selector({
      kyc: {
        kycInfo: { verifyStatus: 1, primaryVerifyStatus: 1 },
        kycClearInfo: { clearStatus: -1 },
      },
    }),
  );
  const { rerender } = renderHook(useCompatibleKyc1);
  rerender();
});

test('test clearance', () => {
  useSelector.mockImplementation((selector) =>
    selector({
      kyc: {
        kycInfo: { verifyStatus: 1, primaryVerifyStatus: 1 },
        kycClearInfo: { clearStatus: 1 },
      },
    }),
  );
  const { rerender } = renderHook(useCompatibleKyc1);
  rerender();
});

