import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import goVerify from '../src/utils/goVerify';
import { getValidationRating, sendValidationCode, verifyValidationCode } from '../src/services';

jest.mock('../src/services', () => ({
  __esModule: true,
  getValidationRating: jest.fn(),
  sendValidationCode: jest.fn(),
  verifyValidationCode: jest.fn()
}));

jest.mock('../src/utils/getDva', () => ({
  __esModule: true,
  default: () => Promise.resolve({
    store: {
      dispatch: jest.fn(),
      subscribe: jest.fn(),
      getState: jest.fn(() => ({
        user: {
          user: {}
        }
      }))
    }
  })
}));

const BIZ_TYPE = 'MOCK_BIZ_TYPE';
const TRANSACTION_ID = 'MOCK_TRANSACTION_ID';
const TOKEN = 'MOCK_TOKEN';
const MODAL_CONTAINER_ID = 'security-verify-modal-root';
const MODAL_ID = 'security-verify-modal';
const ERROR_DIALOG_ID = 'error-dialog';
const FORM_ID = 'inner-form';
const SUBMIT_BUTTON_ID = 'submit-button';
const CHANGE_BUTTON_ID = 'change-button';

/**
 * 触发弹窗的动画结束事件
 * - api 内部监听动画结束后会把容器 dom 移除
 * - 由于 jest 不会处理动画，不会触发 animationEnd
 * - 这里手动触发一次
 */
const dispatchAnimationEnd = () => {
  const $dialog = screen.getByTestId(MODAL_ID);
  fireEvent.animationEnd($dialog);
}

/** 触发 error 弹窗的确认按钮的点击事件 */
const dispatchErrorConfirm = () => {
  const $errConfirm = screen.getByTestId('error-dialog-confirm');
  fireEvent.click($errConfirm);
}

/** 触发弹窗关闭 */
const dispatchModalClose = () => {
  const $model = screen.getByTestId(MODAL_ID);
  const $closeButton = $model.querySelector('.KuxModalHeader-close');
  fireEvent.click($closeButton);
  dispatchAnimationEnd();
}

/** 触发提交 */
const dispatchSubmit = () => {
  const $submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);
  fireEvent.click($submitButton);
  dispatchAnimationEnd();
}

/** 选择其他可选验证方案 */
const dispatchChangeMethod = async (index) => {
  await waitFor(() => {
    const $changeButton = screen.getByTestId(CHANGE_BUTTON_ID);
    fireEvent.click($changeButton);
  });
  await waitFor(() => {
    const $methodSelector = screen.getByTestId('method-selector');
    fireEvent.click($methodSelector.childNodes[index]);
  });
}

const checkExist = (testId) => {
  const $elm = screen.queryByTestId(testId);
  expect($elm).toBeInTheDocument();
}

const checkNotExist = (testId) => {
  const $elm = screen.queryByTestId(testId);
  expect($elm).not.toBeInTheDocument();
}

describe('测试 goVerify api:', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  afterEach(() => {
    getValidationRating.mockRestore();
    sendValidationCode.mockRestore();
    verifyValidationCode.mockRestore();
  });
  afterAll(() => {
    console.error.mockRestore();
  });

  it('不需要验证', async () => {
    getValidationRating.mockResolvedValue({
      code: '200',
      data: {
        needVerify: false,
        token: TOKEN,
        transactionId: '',
        best: [],
        others: []
      }
    });
    const token = await goVerify({ bizType: BIZ_TYPE });
    expect(token).toBe(TOKEN);
  });

  describe('需要验证', () => {
    describe('有不支持的验证方式', () => {
      it('推荐验证方案有不支持的验证方式', async () => {
        getValidationRating.mockResolvedValue({
          code: '200',
          data: {
            needVerify: true,
            token: null,
            transactionId: TRANSACTION_ID,
            best: ['XXX'],
            others: []
          }
        });
        let token = null;
        goVerify({ bizType: BIZ_TYPE }).then(res => token = res);
        // 出现 error 弹窗，无法进行验证，点击确认退出
        await waitFor(() => {
          checkExist(ERROR_DIALOG_ID);
          dispatchErrorConfirm();
          dispatchAnimationEnd();
        });
        await waitFor(() => {
          expect(token).toBe('');
          checkNotExist(MODAL_CONTAINER_ID);
        });
      });
  
      it('可选验证方案有不支持的验证方式', async () => {
        getValidationRating.mockResolvedValue({
          code: '200',
          data: {
            needVerify: true,
            token: null,
            transactionId: TRANSACTION_ID,
            best: ['EMV', 'SMS'],
            others: [['EMV', 'XXX']]
          }
        });
        let token = null;
        goVerify({ bizType: BIZ_TYPE }).then(res => token = res);
        await dispatchChangeMethod(0);
        await waitFor(() => {
          // 检查是否出现 error 弹窗
          checkExist(ERROR_DIALOG_ID);
          dispatchErrorConfirm();
        });
        await waitFor(() => {
          dispatchModalClose();
        });
        await waitFor(() => {
          expect(token).toBe('');
          checkNotExist(MODAL_CONTAINER_ID);
        });
      });
    });
  
    it('仅支持 1 种验证方式', async () => {
      getValidationRating.mockResolvedValue({
        code: '200',
        data: {
          needVerify: true,
          token: null,
          transactionId: TRANSACTION_ID,
          best: ['EMV'],
          others: []
        }
      });
      sendValidationCode.mockResolvedValue({
        code: '200',
        data: { retryAfterSeconds: 60 }
      });
      verifyValidationCode.mockResolvedValue({
        code: '200',
        data: { token: TOKEN }
      });
      let token = null;
      goVerify({ bizType: BIZ_TYPE }).then(res => token = res);
      await waitFor(() => {
        // 仅 1 种方案时无切换按钮
        checkNotExist(CHANGE_BUTTON_ID);
      });
      // 检查发送验证码接口入参
      expect(sendValidationCode).toHaveBeenCalledWith({
        bizType: BIZ_TYPE,
        transactionId: TRANSACTION_ID,
        sendChannel: 'MY_EMV'
      });
      const $form = screen.getByTestId(FORM_ID);
      // 模拟用户输入
      const $input = $form.querySelector('.security-verify-input');
      const EMAIL_CODE = '666666';
      await userEvent.type($input, EMAIL_CODE);
      dispatchSubmit();
      // 检查检验接口入参
      expect(verifyValidationCode).toHaveBeenCalledWith({
        bizType: BIZ_TYPE,
        transactionId: TRANSACTION_ID,
        validations: { MY_EMV: EMAIL_CODE }
      });
      await waitFor(() => {
        expect(token).toBe(TOKEN);
        checkNotExist(MODAL_CONTAINER_ID);
      });
    });

    it('支持多种混合的验证方式', async () => {
      // 1 期仅支持邮箱（EMV）、短信（SMS）、Google（GAV）和交易密码（TP）
      getValidationRating.mockResolvedValue({
        code: '200',
        data: {
          needVerify: true,
          token: null,
          transactionId: TRANSACTION_ID,
          best: ['EMV', 'SMS'],
          others: [['EMV', 'SMS', 'GAV', 'TP']]
        }
      });
      verifyValidationCode.mockResolvedValue({
        code: '200',
        data: { token: TOKEN }
      });
      let token = null;
      goVerify({ bizType: BIZ_TYPE }).then(res => token = res);
      await dispatchChangeMethod(0);
      const $form = screen.getByTestId(FORM_ID);
      // 模拟用户输入
      const INPUT_VALUE = '666666';
      // 交易密码需要密文发送，用 src/utils/crypto 函数对 INPUT_VALUE 加密
      const CRYPTO_INPUT_VALUE = '78e7845b0bd4dfd5ecd21e159266e249';
      const $inputs = $form.querySelectorAll('.security-verify-input');
      for(let i = 0; i < $inputs.length; i++) {
        await userEvent.type($inputs[i], INPUT_VALUE);
      }
      await waitFor(() => {
        dispatchSubmit();
        expect(verifyValidationCode).toHaveBeenCalledWith({
          bizType: BIZ_TYPE,
          transactionId: TRANSACTION_ID,
          validations: {
            MY_EMV: INPUT_VALUE,
            MY_SMS: INPUT_VALUE,
            GAV: INPUT_VALUE,
            TP: CRYPTO_INPUT_VALUE
          }
        });
      })
      await waitFor(() => {
        expect(token).toBe(TOKEN);
        checkNotExist(MODAL_CONTAINER_ID);
      });

    });
  });
});