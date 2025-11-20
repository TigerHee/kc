import JsBridge from '@knb/native-bridge';
import { fireEvent, waitFor } from '@testing-library/react';
import Authentication from 'src/components/Authentication';
import { customRender } from 'test/setup';

jest.mock('@kux/mui', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@kux/mui'),
    useSnackbar: () => {
      return {
        message: {
          error: () => {},
        },
      };
    },
  };
});

describe('test Authentication', () => {
  beforeEach(() => {
    JsBridge.isApp.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('test Authentication render', async () => {
    customRender(
      <Authentication
        namespace="forget_withdraw_password"
        bizType="FORGET_WITHDRAWAL_PASSWORD"
        onSubmit={() => {}}
      />,
      {
        forget_withdraw_password: {
          status: null,
          fields: {},
          fieldLoading: {},
          configs: {
            IOS_FACE_MATCH: { isOpen: true, maxRetries: 3 },
            ANDROID_FACE_MATCH: { isOpen: true, maxRetries: 3 },
            IDENTITY_FAIL: { maxRetries: 3 },
          },
          kycCode: 'testKycCode',
          isKYC2: false,
        },
        app: {
          appVersion: '3.117.0',
        },
        loading: {
          effects: {
            'forget_withdraw_password/checkFacePic': false,
            'forget_withdraw_password/pullKycInfo': false,
            'reset_g2fa/submitAuthentication': false,
            'rebind_phone/submitNewPhone': false,
          },
        },
      },
    );
  });

  test('test Authentication render & submit form', async () => {
    const onSubmitMock = jest.fn();
    const { getByTestId } = customRender(
      <Authentication
        namespace="forget_withdraw_password"
        bizType="FORGET_WITHDRAWAL_PASSWORD"
        onSubmit={() => {}}
      />,
      {
        forget_withdraw_password: {
          status: null,
          fields: {},
          fieldLoading: {},
          configs: {
            IOS_FACE_MATCH: { isOpen: true, maxRetries: 3 },
            ANDROID_FACE_MATCH: { isOpen: true, maxRetries: 3 },
            IDENTITY_FAIL: { maxRetries: 3 },
          },
          kycCode: 'testKycCode',
          isKYC2: false,
        },
        app: {
          appVersion: '3.117.0',
        },
        loading: {
          effects: {
            'forget_withdraw_password/checkFacePic': false,
            'forget_withdraw_password/pullKycInfo': false,
            'reset_g2fa/submitAuthentication': false,
            'rebind_phone/submitNewPhone': false,
          },
        },
      },
    );
    const submitButton = getByTestId('authentication-submit');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });

  test('renders Authentication component and submits form and click items', async () => {
    const onSubmitMock = jest.fn();
    const { getByTestId } = customRender(
      <Authentication
        namespace="forget_withdraw_password"
        bizType="FORGET_WITHDRAWAL_PASSWORD"
        onSubmit={onSubmitMock}
      />,
      {
        forget_withdraw_password: {
          status: null,
          fields: {},
          fieldLoading: {},
          configs: {
            IOS_FACE_MATCH: { isOpen: true, maxRetries: 3 },
            ANDROID_FACE_MATCH: { isOpen: true, maxRetries: 3 },
            IDENTITY_FAIL: { maxRetries: 3 },
          },
          kycCode: 'testKycCode',
          isKYC2: false,
        },
        app: {
          appVersion: '3.117.0',
        },
        loading: {
          effects: {
            'forget_withdraw_password/checkFacePic': false,
            'forget_withdraw_password/pullKycInfo': false,
            'reset_g2fa/submitAuthentication': false,
            'rebind_phone/submitNewPhone': false,
          },
          forget_withdraw_password: { status: null, fields: {}, fieldLoading: {} },
          app: {
            appVersion: '3.117.0',
          },
        },
      },
    );

    const frontPicDiv = getByTestId('frontPic');
    const backPicDiv = getByTestId('backPic');
    const handPicDiv = getByTestId('handPic');
    fireEvent.click(frontPicDiv);
    fireEvent.click(backPicDiv);
    fireEvent.click(handPicDiv);
    fireEvent.click(getByTestId('authentication-submit'));
  });

  // if (isKYC2 && isInApp && retrySDKTimes < MAX_SDK_TIMES) {
  test('test Authentication', () => {
    jest.spyOn(JsBridge, 'isApp').mockReturnValue(true);
    customRender(
      <Authentication
        namespace="forget_withdraw_password"
        bizType="FORGET_WITHDRAWAL_PASSWORD"
        onSubmit={() => {}}
      />,
      {
        forget_withdraw_password: {
          status: null,
          fields: {},
          fieldLoading: {},
          isKYC2: true,
        },
        app: {
          appVersion: '3.117.0',
        },
      },
    );

    fireEvent.click(document.querySelector('button'));
  });
  test('test Authentication', () => {
    jest.spyOn(JsBridge, 'isApp').mockReturnValue(true);
    customRender(
      <Authentication
        namespace="forget_withdraw_password"
        bizType="FORGET_WITHDRAWAL_PASSWORD"
        onSubmit={() => {}}
      />,
      {
        forget_withdraw_password: {
          status: null,
          fields: {},
          fieldLoading: {},
          isKYC2: false,
        },
        app: {
          appVersion: '3.117.0',
        },
      },
    );

    fireEvent.click(document.querySelector('button'));
  });
  test('test Authentication', () => {
    jest.spyOn(JsBridge, 'isApp').mockReturnValue(false);
    customRender(
      <Authentication
        namespace="forget_withdraw_password"
        bizType="FORGET_WITHDRAWAL_PASSWORD"
        onSubmit={() => {}}
      />,
      {
        forget_withdraw_password: {
          status: null,
          fields: {},
          fieldLoading: {},
          isKYC2: true,
          configs: {
            IOS_FACE_MATCH: { isOpen: false, maxRetries: 3 },
            ANDROID_FACE_MATCH: { isOpen: false, maxRetries: 3 },
            IDENTITY_FAIL: { maxRetries: 3 },
          },
        },
        app: {
          appVersion: '3.117.0',
        },
      },
    );

    fireEvent.click(document.querySelector('button'));
  });
});
