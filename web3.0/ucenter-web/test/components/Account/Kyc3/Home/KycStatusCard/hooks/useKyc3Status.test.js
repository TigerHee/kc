/**
 * Owner: tiger@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import useKyc3Status from 'src/routes/AccountPage/Kyc/KycHome/site/KC/hooks/useKyc3Status';

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
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn((cb) => cb(state)),
  };
});

[-1, 0, 1, 2, 3, 4, 5, 6, 7].forEach((status) => {
  test('test useKyc3Status', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        kyc: {
          kycInfo: { verifyStatus: status, primaryVerifyStatus: status },
          kycClearInfo: { clearStatus: status },
        },
      }),
    );
    const { rerender } = renderHook(useKyc3Status);
    rerender();
  });
});

test('test useKyc3Status', () => {
  useSelector.mockImplementation((selector) =>
    selector({
      kyc: {
        kycInfo: { verifyStatus: -1, primaryVerifyStatus: 1 },
        kycClearInfo: { clearStatus: 100 },
      },
    }),
  );
  const { rerender } = renderHook(useKyc3Status);
  rerender();
});

test('test useKyc3Status', () => {
  useSelector.mockImplementation((selector) =>
    selector({
      kyc: {
        kycInfo: { verifyStatus: 1 },
        kycClearInfo: { clearStatus: 100 },
      },
    }),
  );
  const { rerender } = renderHook(useKyc3Status);
  rerender();
});
test('test useKyc3Status', () => {
  useSelector.mockImplementation((selector) =>
    selector({
      kyc: {
        kycInfo: {},
        kycClearInfo: {},
      },
    }),
  );
  const { rerender } = renderHook(useKyc3Status);
  rerender();
});

[false, true].forEach((recharged) => {
  test('test useKyc3Status recharged', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        kyc: {
          kycInfo: { verifyStatus: 1, regionType: 3 },
          kycClearInfo: { clearStatus: 100 },
        },
        user: {
          recharged,
        },
      }),
    );
    const { rerender } = renderHook(useKyc3Status);
    rerender();
  });
});
