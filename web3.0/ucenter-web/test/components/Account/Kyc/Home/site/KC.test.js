
import { customRender } from 'test/setup';
import { merge } from 'lodash';
import { fireEvent } from '@testing-library/react';
import KCKycHome from 'src/routes/AccountPage/Kyc/Home/site/KC/index';
import { replace } from 'src/utils/router';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
  };
});

jest.mock('src/utils/router', () => {
  return {
    ...jest.requireActual('src/utils/router'),
    push: jest.fn(),
    replace: jest.fn()
  };
});

const originStore = {
  kyc: {
    kycInfo: {
      verifyStatus: -1,
      primaryVerifyStatus: -1,
    },
    kycClearInfo: {
      clearStatus: -1,
    },
    privileges: {},
    financeListKYC: []
  },
  user: {
    recharged: false,
    isLogin: true,
  },
};

describe('KC site', () => {
  describe('Not British users', () => {
    test('kyc basic certification: unverified', () => {
      customRender(<KCKycHome />, merge({}, originStore));
      expect(replace).toHaveBeenCalledWith('/account/kyc');
    });
    test('kyc basic certification: suspend', () => {
      customRender(<KCKycHome />, merge({}, originStore, {
        kyc: { kycInfo: { primaryVerifyStatus: 1 } }
      }));
      expect(replace).toHaveBeenCalledWith('/account/kyc');
    });
    test('kyc basic certification: suspend', () => {
      customRender(<KCKycHome />, merge({}, originStore, {
        kyc: { kycInfo: { primaryVerifyStatus: 1 } }
      }));
      expect(replace).toHaveBeenCalledWith('/account/kyc');
    });
    test('kyc basic certification: verifying', () => {
      customRender(<KCKycHome />, merge({}, originStore, {
        kyc: { kycInfo: { verifyStatus: 0 } }
      }));
    });
    test('kyc basic certification: rejected', () => {
      customRender(<KCKycHome />, merge({}, originStore, {
        kyc: { kycInfo: { verifyStatus: 2, failureReasonLists: [] } }
      }));
    });
    test('kyc basic certification: verified', () => {
      customRender(<KCKycHome />, merge({}, originStore, {
        kyc: { kycInfo: { verifyStatus: 1, clearStatus: 2 } }
      }));
    });
    test('kyc basic certification: verified', () => {
      customRender(<KCKycHome />, merge({}, originStore, {
        kyc: { kycInfo: { verifyStatus: 1 } }
      }));
    });
  });
  
  describe('British users', () => {
    const store = merge({}, originStore, { kyc: { kycInfo: { regionCode: 'GB' } }});
    test('kyc basic certification: unverified', () => {
      customRender(<KCKycHome />, merge({}, store));
      expect(replace).toHaveBeenCalledWith('/account/kyc');
    });
    test('kyc basic certification: suspend', () => {
      customRender(<KCKycHome />, merge({}, store, {
        kyc: { kycInfo: { primaryVerifyStatus: 1 } }
      }));
      expect(replace).toHaveBeenCalledWith('/account/kyc');
    });
    test('kyc basic certification: verifying', () => {
      customRender(<KCKycHome />, merge({}, store, {
        kyc: { kycInfo: { verifyStatus: 0 } }
      }));
    });
    test('kyc basic certification: rejected', () => {
      customRender(<KCKycHome />, merge({}, store, {
        kyc: { kycInfo: { verifyStatus: 2, failureReasonLists: [] } }
      }));
    });
    test('kyc basic certification: verified', () => {
      customRender(<KCKycHome />, merge({}, store, {
        kyc: {
          kycInfo: { verifyStatus: 1 },
          financeListKYC: [{ status: -1 }]
        }
      }));
    });
    test('kyc PI certification: verifying', () => {
      customRender(<KCKycHome />, merge({}, store, {
        kyc: {
          kycInfo: { verifyStatus: 1 },
          financeListKYC: [{ status: 0 }]
        }
      }));
    });
    test('kyc PI certification: rejected', () => {
      customRender(<KCKycHome />, merge({}, store, {
        kyc: {
          kycInfo: { verifyStatus: 1 },
          financeListKYC: [{ status: 9, verifyStatus: false }]
        }
      }));
    });
    test('kyc PI certification: verified', () => {
      customRender(<KCKycHome />, merge({}, store, {
        kyc: {
          kycInfo: { verifyStatus: 1 },
          financeListKYC: [{ status: 9, verifyStatus: true }]
        }
      }));
    });
  })
});