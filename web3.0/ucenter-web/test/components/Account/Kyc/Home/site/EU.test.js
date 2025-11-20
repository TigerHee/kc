import { customRender } from 'test/setup';
import { merge } from 'lodash';
import { fireEvent, waitFor } from '@testing-library/react';
import EUKycHome from 'src/routes/AccountPage/Kyc/Home/site/EU/index';
import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { getSubUserInfo, getTempValue, postTempValue } from 'src/services/kyc';

const mockDispatch = jest.fn().mockResolvedValue({});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
  };
});

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
  user: {
    recharged: false,
    isLogin: true,
  },
};

describe('EU site', () => {
  describe('kyc 1', () => {
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
    test('kyc1 unverified', () => {
      const mockOnBack = jest.fn();
      getSubUserInfo.mockResolvedValue({
        success: true,
        code: '200',
        data: { status: KYC_STATUS_ENUM.UNVERIFIED, failReasonList: [], extraInfo: null },
      });
      const { getByTestId } = customRender(<EUKycHome onBack={mockOnBack} />, originStore);
    });
  
    test('kyc1 ongoing', () => {
      const mockOnBack = jest.fn();
      getSubUserInfo.mockResolvedValue({
        success: true,
        code: '200',
        data: { status: KYC_STATUS_ENUM.SUSPEND, failReasonList: [], extraInfo: null },
      });
      const { getByTestId } = customRender(<EUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc: {
          kycInfo: {
            verifyStatus: -1,
            primaryVerifyStatus: 1
          }
        }
      }));
      const backBtn = getByTestId('back');
    });
  
    test('kyc1 verifying', () => {
      const mockOnBack = jest.fn();
      getSubUserInfo.mockResolvedValue({
        success: true,
        code: '200',
        data: { status: KYC_STATUS_ENUM.VERIFYING, failReasonList: [], extraInfo: null },
      });
      customRender(<EUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc: {
          kycInfo: {
            verifyStatus: 0
          }
        }
      }));
    });
  
    test('kyc1 rejected', () => {
      const mockOnBack = jest.fn();
      getSubUserInfo.mockResolvedValue({
        success: true,
        code: '200',
        data: { status: KYC_STATUS_ENUM.REJECTED, failReasonList: ['hello', 'world'], extraInfo: null },
      })
      customRender(<EUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc: {
          kycInfo: {
            verifyStatus: 2
          }
        }
      }));
    });

    test('kyc1 verified', () => {
      const mockOnBack = jest.fn();
      getSubUserInfo.mockResolvedValue({
        success: true,
        code: '200',
        data: { status: KYC_STATUS_ENUM.VERIFIED, failReasonList: [], extraInfo: null },
      });
      customRender(<EUKycHome onBack={mockOnBack} />, merge({}, originStore, {
        kyc: {
          kycInfo: {
            verifyStatus: 1
          }
        },
      }));
    });
  });
});