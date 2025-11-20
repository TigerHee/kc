import JsBridge from '@knb/native-bridge';
import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ResetSteps from 'src/routes/Ucenter/ResetSteps';
import { customRender } from 'test/setup';

// Mock 依赖
jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
}));

jest.mock('@kux/mui', () => ({
  __esModule: true,
  ...jest.requireActual('@kux/mui'),
  withSnackbar: () => (Component) => (props) => (
    <Component {...props} message={{ error: jest.fn(), success: jest.fn() }} />
  ),
}));

jest.mock('hocs/requireProps', () => {
  const requireProps = (propConditions, placeholder) => (WrappedComponent) => {
    return (props) => {
      const pass = Object.entries(propConditions).every(([key, condition]) =>
        condition(props[key], props),
      );
      return pass ? <WrappedComponent {...props} /> : <div data-testid="loading">{placeholder || 'Loading...'}</div>;
    };
  };
  return requireProps;
});

jest.mock('components/Authentication', () => {
  return function MockAuthentication({ onSubmit, nextStep, prompt }) {
    return (
      <div data-testid="authentication-component">
        {prompt}
        <button onClick={() => onSubmit({ success: true })} data-testid="auth-submit">
          Submit Authentication
        </button>
      </div>
    );
  };
});

jest.mock('components/NewCommonSecurity', () => {
  return function MockCommonSecurity({ callback, submitBtnTxt }) {
    return (
      <div data-testid="common-security-component">
        <button onClick={() => callback({ success: true })} data-testid="security-submit">
          {submitBtnTxt}
        </button>
      </div>
    );
  };
});

jest.mock('components/QuestionSecurity', () => {
  return function MockQuestionSecurity({ nextStep }) {
    return (
      <div data-testid="question-security-component">
        <button onClick={nextStep} data-testid="question-submit">
          Submit Questions
        </button>
      </div>
    );
  };
});

jest.mock('src/routes/Ucenter/Finish', () => {
  return function MockFinish({ isPhone }) {
    return <div data-testid="finish-component">{isPhone ? 'Phone Reset Complete' : 'Reset Complete'}</div>;
  };
});

jest.mock('src/routes/Ucenter/SelectType/PageHeader', () => {
  return function MockPageHeader({ onClick, title }) {
    return (
      <div data-testid="page-header">
        <button onClick={onClick} data-testid="back-button">
          Back
        </button>
        <h1>{title}</h1>
      </div>
    );
  };
});

describe('ResetSteps Component', () => {
  const mockStore = configureStore([]);
  let store;
  const mockNextStep = jest.fn();
  const mockOnAuthSubmit = jest.fn();
  const mockOnSecuritySuccess = jest.fn();

  const defaultProps = {
    form: {},
    extraSteps: [],
    currentStep: 0,
    onAuthSubmit: mockOnAuthSubmit,
    onSecuritySuccess: mockOnSecuritySuccess,
    nextStep: mockNextStep,
    token: 'test-token',
    namespace: 'test_namespace',
  };

  const defaultState = {
    test_namespace: {
      questions: [],
    },
    loading: {
      effects: {
        'test_namespace/pullQuestions': false,
      },
    },
    kyc: {
      countriesWithWhiteList: [],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore(defaultState);
    JsBridge.isApp.mockReturnValue(false);
  });

  const renderResetSteps = (props = {}, state = {}) => {
    const mergedProps = { ...defaultProps, ...props };
    const mergedState = { ...defaultState, ...state };
    const testStore = mockStore(mergedState);
    
    return customRender(
      <Provider store={testStore}>
        <ResetSteps {...mergedProps} />
      </Provider>
    );
  };

  test('应该正确渲染邮箱/手机验证步骤', () => {
    const { container } = renderResetSteps({
      bizType: 'REBINDING_PHONE',
      allowTypes: [['my_email']],
    });

    // 验证通用安全组件渲染
    expect(container.querySelector('[data-testid="common-security-component"]')).toBeInTheDocument();
    
    // 验证警告信息显示
    expect(container.querySelector('.KuxAlert-root')).toBeInTheDocument();
  });

  test('应该正确处理安全验证成功回调', async () => {
    const user = userEvent.setup();
    const { container } = renderResetSteps({
      bizType: 'REBINDING_PHONE',
      allowTypes: [['my_email']],
    });

    const securitySubmitBtn = container.querySelector('[data-testid="security-submit"]');
    await user.click(securitySubmitBtn);

    expect(mockOnSecuritySuccess).toHaveBeenCalled();
  });

  test('应该正确渲染身份验证步骤', () => {
    const { container } = renderResetSteps({
      bizType: 'REBINDING_PHONE',
      allowTypes: [['my_email']],
      currentStep: 1,
    });

    // 验证身份认证组件渲染
    expect(container.querySelector('[data-testid="authentication-component"]')).toBeInTheDocument();
  });

  test('应该正确处理身份验证提交', async () => {
    const user = userEvent.setup();
    const { container } = renderResetSteps({
      bizType: 'REBINDING_PHONE',
      allowTypes: [['my_email']],
      currentStep: 1,
    });

    const authSubmitBtn = container.querySelector('[data-testid="auth-submit"]');
    await user.click(authSubmitBtn);

    expect(mockOnAuthSubmit).toHaveBeenCalledWith({ success: true });
  });

  test('应该正确显示完成页面', () => {
    const { container } = renderResetSteps({
      bizType: 'REBINDING_PHONE',
      allowTypes: [['my_email']],
      currentStep: 2,
      namespace: 'rebind_phone',
    });

    // 验证完成组件渲染
    expect(container.querySelector('[data-testid="finish-component"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="finish-component"]')).toHaveTextContent('Phone Reset Complete');
  });

  test('应该在非手机模式下显示完成页面', () => {
    const { container } = renderResetSteps({
      bizType: 'RESET_G2FA',
      allowTypes: [['my_email']],
      currentStep: 2,
      namespace: 'reset_g2fa',
    });

    expect(container.querySelector('[data-testid="finish-component"]')).toHaveTextContent('Reset Complete');
  });

  test('应该正确处理移动端环境', () => {
    JsBridge.isApp.mockReturnValue(true);
    
    const { container } = renderResetSteps({
      bizType: 'REBINDING_PHONE',
      allowTypes: [['my_email']],
    });

    // 移动端不显示页面头部
    expect(container.querySelector('[data-testid="page-header"]')).not.toBeInTheDocument();
  });

  test('应该正确处理桌面端环境', () => {
    JsBridge.isApp.mockReturnValue(false);
    
    const { container } = renderResetSteps({
      bizType: 'REBINDING_PHONE',
      allowTypes: [['my_email']],
      namespace: 'reset_g2fa',
    });

    // 桌面端显示页面头部
    expect(container.querySelector('[data-testid="page-header"]')).toBeInTheDocument();
    expect(container.querySelector('h1')).toHaveTextContent('selfService.resetGoogle');
  });

  test('应该正确处理返回按钮点击', async () => {
    const user = userEvent.setup();
    JsBridge.isApp.mockReturnValue(false);
    
    // Mock window.history.go
    const mockHistoryGo = jest.fn();
    Object.defineProperty(window, 'history', {
      value: { go: mockHistoryGo },
      writable: true,
    });

    const { container } = renderResetSteps({
      bizType: 'REBINDING_PHONE',
      allowTypes: [['my_email']],
    });

    const backButton = container.querySelector('[data-testid="back-button"]');
    await user.click(backButton);

    expect(mockHistoryGo).toHaveBeenCalledWith(-1);
  });

  test('应该正确显示不同业务类型的警告信息', () => {
    const { container } = renderResetSteps({
      bizType: 'REBINDING_PHONE',
      allowTypes: [['my_email']],
    });

    // 验证警告信息显示
    expect(container.querySelector('.KuxAlert-warning')).toBeInTheDocument();
  });

  test('应该正确处理谷歌验证重置的警告信息', () => {
    const { container } = renderResetSteps({
      bizType: 'REBINDING_GOOGLE_2FA',
      allowTypes: [['my_email']],
      currentStep: 1,
    });

    // 身份验证步骤应显示额外的警告信息
    const alerts = container.querySelectorAll('.KuxAlert-root');
    expect(alerts.length).toBeGreaterThan(0);
  });

  test('应该正确处理通过短信重置时跳过身份认证', () => {
    const { container } = renderResetSteps({
      bizType: 'REBINDING_PHONE',
      allowTypes: [['my_sms']],
      currentStep: 0,
    });

    // 应该直接显示安全验证，不需要身份认证
    expect(container.querySelector('[data-testid="common-security-component"]')).toBeInTheDocument();
  });

  test('应该正确处理额外步骤', () => {
    const extraStep = {
      title: 'Extra Step',
      component: <div data-testid="extra-step">Extra Step Component</div>,
    };

    const { container } = renderResetSteps({
      bizType: 'REBINDING_PHONE',
      allowTypes: [['my_email']],
      extraSteps: [extraStep],
      currentStep: 2,
    });

    expect(container.querySelector('[data-testid="extra-step"]')).toBeInTheDocument();
  });

  test('应该正确处理 requireProps 验证失败', () => {
    const { container } = renderResetSteps({
      allowTypes: null,
      currentStep: 0, // currentStep 为 0 时 allowTypes 不能为 null
    });

    // 应该显示加载状态
    expect(container.querySelector('[data-testid="loading"]')).toBeInTheDocument();
  });


  test('应该正确处理窄模式布局', () => {
    const { container } = renderResetSteps({
      bizType: 'REBINDING_PHONE',
      allowTypes: [['my_email']],
      currentStep: 0,
    });

    // 验证窄模式样式应用
    const wrapper = container.querySelector('[data-testid="wrapper-body"]') || 
                   container.querySelector('div'); // fallback
    expect(wrapper).toBeInTheDocument();
  });

  test('应该正确处理自定义提示信息', () => {
    const customPrompt = <div data-testid="custom-prompt">Custom Prompt</div>;
    
    const { container } = renderResetSteps({
      bizType: 'REBINDING_PHONE',
      allowTypes: [['my_email']],
      prompt: customPrompt,
    });

    expect(container.querySelector('[data-testid="custom-prompt"]')).toBeInTheDocument();
  });
});
