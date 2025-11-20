import React from 'react';
import { customRender } from 'test/setup';
import { fireEvent, screen } from '@testing-library/react';
import { useSnackbar } from '@kux/mui';
import Login from 'src/routes/OauthPage/Login';
import { addLangToPath } from 'tools/i18n';
import { push } from 'utils/router';
import { SITE_FORCE_REDIRECT } from 'src/constants';

const mockDispatch = jest.fn().mockResolvedValue({});
jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: jest.fn((selector) => {
      const state = {
        oauth: {
          invitationCode: 'test_code'
        }
      };
      return selector(state);
    }),
  };
});

jest.mock('tools/i18n', () => ({
  _t: (key) => key,
  _tHTML: (key) => key,
  addLangToPath: jest.fn(),
}));

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useSnackbar: jest.fn(),
  useResponsive: () => ({ md: true }),
  useTheme: () => ({ currentTheme: 'light' }),
}));

jest.mock('utils/router', () => ({
  push: jest.fn(),
}));

jest.mock('utils/siteConfig', () => ({
  KUCOIN_HOST: 'https://test.kucoin.com',
}));

jest.mock('@kucoin-base/i18n', () => ({
  useLocale: jest.fn(),
}));

jest.mock('@kucoin-gbiz-next/entrance', () => ({
  LoginNoLayout: ({ onSuccess, onForgetPwdClick, verifyCanNotUseClick, customTitle }) => (
    <div>
      <div data-testid="login-component">Login Component</div>
      <button onClick={() => onSuccess({ token: 'test_token' })}>Login Success</button>
      <button onClick={onForgetPwdClick}>Forget Password</button>
      <button onClick={() => verifyCanNotUseClick('GFA', 'test_token')}>GFA Not Use</button>
      <button onClick={() => verifyCanNotUseClick('SMS', 'test_token')}>SMS Not Use</button>
      {customTitle}
    </div>
  ),
}));

describe('Login Component', () => {
  const mockMessage = { success: jest.fn() };

  beforeEach(() => {
    useSnackbar.mockReturnValue({ message: mockMessage });
    addLangToPath.mockImplementation(path => path);
    // 清除之前的 mock 调用记录
    jest.clearAllMocks();
  });

  it('应该正确渲染登录页面', () => {
    customRender(<Login />, {});

    // 验证基本元素是否存在
    expect(screen.getByText('9hKWxf1jDuDQ6z85SSJri3')).toBeInTheDocument();
    expect(screen.getByText('3568xM5Xxp8mrcGSvfHMpQ')).toBeInTheDocument();
    expect(screen.getByText('qHy6XJWBFKKigXS3GZ7LXG')).toBeInTheDocument();
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
  });

  it('应该正确处理登录成功', async () => {
    customRender(<Login />, {});

    // 点击登录成功按钮
    fireEvent.click(screen.getByText('Login Success'));

    // 验证成功消息和用户信息拉取
    expect(mockMessage.success).toHaveBeenCalledWith('operation.succeed');
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'user/pullUser',
      payload: expect.any(Object),
    }));
  });

  it('应该正确处理站点不一致的情况', async () => {
    const { location } = window;
    delete window.location;
    window.location = { reload: jest.fn() };

    customRender(<Login />, {});

    // 点击登录成功按钮
    fireEvent.click(screen.getByText('Login Success'));

    // 调用 callback 并传入 SITE_FORCE_REDIRECT
    const dispatchCall = mockDispatch.mock.calls[0][0];
    dispatchCall.payload.callback(SITE_FORCE_REDIRECT);

    // 验证页面刷新
    expect(window.location.reload).toHaveBeenCalled();

    // 恢复 window.location
    window.location = location;
  });

  it('应该正确处理忘记密码', () => {
    const { location } = window;
    delete window.location;
    window.location = { href: '' };

    customRender(<Login />, {});

    // 点击忘记密码按钮
    fireEvent.click(screen.getByText('Forget Password'));

    // 验证跳转
    expect(window.location.href).toBe('https://test.kucoin.com/ucenter/reset-password');

    // 恢复 window.location
    window.location = location;
  });

  it('应该正确处理验证方式不可用', () => {
    customRender(<Login />, {});

    // 点击 GFA 不可用按钮
    fireEvent.click(screen.getByText('GFA Not Use'));
    expect(push).toHaveBeenCalledWith('/ucenter/reset-security/token/GFA');

    // 点击 SMS 不可用按钮
    fireEvent.click(screen.getByText('SMS Not Use'));
    expect(push).toHaveBeenCalledWith('/ucenter/reset-security/token/SMS');
  });
});
