import { customRender } from 'test/setup';
import { merge } from 'lodash';
import { fireEvent, waitFor } from '@testing-library/react';
import AUKycHome from 'src/routes/AccountPage/Kyc/Home/site/AU/index';
import { KYC_ROLE_ENUM, KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { getTempValue, postTempValue } from 'src/services/kyc';

const mockDispatch = jest.fn().mockResolvedValue({});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
  };
});

jest.mock('src/config/tenant', () => {
  return {
    __esModule: true,
    tenant: 'AU',
    tenantConfig: {
      kyc: {
        namespace: 'kyc_au'
      }
    }
  }
})

jest.mock('src/services/kyc', () => ({
  ...jest.requireActual('src/services/kyc'),
  getSubUserInfo: jest.fn(),
  getTempValue: jest.fn(),
  postTempValue: jest.fn(),
}));

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
    countries: [
      { code: 'DEMO', name: 'demo', icon: '' }
    ]
  },
  kyc_au: {
    kyc1: { status: KYC_STATUS_ENUM.UNVERIFIED },
    kyc2: { status: KYC_STATUS_ENUM.UNVERIFIED },
    kyc3: { status: KYC_STATUS_ENUM.UNVERIFIED },
    regionCode: 'DEMO',
    identityType: 'passport'
  },
  user: {
    recharged: false,
    isLogin: true,
  },
};

describe('AU site', () => {
  beforeAll(() => {
    getTempValue.mockResolvedValue({
      success: true,
      code: '200',
      data: JSON.stringify({ region: 'FR', identityType: 'passport', type: 1 }),
    });
    postTempValue.mockResolvedValue({
      success: true,
      code: '200',
      data: null,
    });
  });
  describe('kyc 1', () => {
    test('kyc1 unverified', () => {
      const mockOnBack = jest.fn();
      const { getByTestId } = customRender(<AUKycHome onBack={mockOnBack} />, originStore);
    });
  
    test('kyc1 ongoing', () => {
      const mockOnBack = jest.fn();
      const { getByTestId } = customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc: {
          kycInfo: {
            verifyStatus: -1,
            primaryVerifyStatus: 1
          }
        },
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.SUSPEND
          }
        }
      }));
    });
  
    test('kyc1 verifying', () => {
      const mockOnBack = jest.fn();
      customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc: {
          kycInfo: {
            verifyStatus: 0
          }
        },
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.VERIFYING
          }
        }
      }));
    });
  
    test('kyc1 rejected', () => {
      const mockOnBack = jest.fn();
      customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc: {
          kycInfo: {
            verifyStatus: 2
          }
        },
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.REJECTED,
            failReasonList: ['hello', 'world']
          }
        }
      }));
    });

    test('kyc1 verified', () => {
      const mockOnBack = jest.fn();
      customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc: {
          kycInfo: {
            verifyStatus: 1
          }
        },
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.VERIFIED
          }
        }
      }));
    });
  });

  describe('kyc 2', () => {
    test('kyc2 unverified', () => {
      const mockOnBack = jest.fn();
      customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.VERIFIED
          },
          kyc2: {
            status: KYC_STATUS_ENUM.UNVERIFIED
          },
          role: KYC_ROLE_ENUM.RETAIL
        }
      }));
    });

    test('kyc2 ongoing', () => {
      const mockOnBack = jest.fn();
      customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.VERIFIED
          },
          kyc2: {
            status: KYC_STATUS_ENUM.SUSPEND
          },
          role: KYC_ROLE_ENUM.RETAIL
        }
      }));
    });

    test('kyc2 verifying', () => {
      const mockOnBack = jest.fn();
      customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.VERIFIED
          },
          kyc2: {
            status: KYC_STATUS_ENUM.VERIFYING
          },
          role: KYC_ROLE_ENUM.RETAIL
        }
      }));
    });

    test('kyc2 rejected', () => {
      const mockOnBack = jest.fn();
      customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.VERIFIED
          },
          kyc2: {
            status: KYC_STATUS_ENUM.REJECTED,
            failReasonList: ['hello', 'world']
          },
          role: KYC_ROLE_ENUM.RETAIL
        }
      }));
    });

    test('kyc2 verified', () => {
      const mockOnBack = jest.fn();
      customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.VERIFIED
          },
          kyc2: {
            status: KYC_STATUS_ENUM.VERIFIED
          },
          role: KYC_ROLE_ENUM.RETAIL
        }
      }));
    });
  });

  describe('kyc 3', () => {
    test('kyc3 unverified', () => {
      const mockOnBack = jest.fn();
      customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.VERIFIED
          },
          kyc3: {
            status: KYC_STATUS_ENUM.UNVERIFIED
          },
          role: KYC_ROLE_ENUM.WHOLESALE
        }
      }));
    });

    test('kyc3 ongoing', () => {
      const mockOnBack = jest.fn();
      customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.VERIFIED
          },
          kyc3: {
            status: KYC_STATUS_ENUM.SUSPEND
          },
          role: KYC_ROLE_ENUM.WHOLESALE
        }
      }));
    });

    test('kyc3 verifying', () => {
      const mockOnBack = jest.fn();
      customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.VERIFIED
          },
          kyc3: {
            status: KYC_STATUS_ENUM.VERIFYING
          },
          role: KYC_ROLE_ENUM.WHOLESALE
        }
      }));
    });

    test('kyc3 rejected', () => {
      const mockOnBack = jest.fn();
      customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.VERIFIED
          },
          kyc3: {
            status: KYC_STATUS_ENUM.REJECTED,
            failReasonList: ['hello', 'world']
          },
          role: KYC_ROLE_ENUM.RETAIL
        }
      }));
    });

    test('kyc3 verified', () => {
      const mockOnBack = jest.fn();
      customRender(<AUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc_au: {
          kyc1: {
            status: KYC_STATUS_ENUM.VERIFIED
          },
          kyc3: {
            status: KYC_STATUS_ENUM.VERIFIED
          },
          role: KYC_ROLE_ENUM.RETAIL
        }
      }));
    });
  });
});