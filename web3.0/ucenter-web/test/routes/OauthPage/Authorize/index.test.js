import verification from '@kucoin-gbiz-next/verification';
import { useSnackbar } from '@kux/mui';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { searchToJson } from 'helper';
import Authorize from 'src/routes/OauthPage/Authorize';
import { customRender } from 'test/setup';
import { addLangToPath } from 'tools/i18n';
import memStorage from 'tools/memStorage';

const mockDispatch = jest.fn().mockResolvedValue({});
jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
  };
});

jest.mock('tools/i18n', () => ({
  _t: (key) => key,
  _tHTML: (key) => key,
  addLangToPath: jest.fn(),
  getCurrentLangFromPath: jest.fn(),
}));

// Mock dependencies
jest.mock('@kucoin-gbiz-next/verification');
jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useSnackbar: jest.fn(),
}));
jest.mock('helper');
jest.mock('tools/memStorage');

const { goVerifyLegacy } = verification;

describe('Authorize Component', () => {
  const mockMessage = { error: jest.fn() };
  const mockUserInfo = {
    isSub: false,
    type: 1,
  };

  const mockState = {
    oauth: {
      invitationCode: 'test_code',
    },
    loading: {
      effects: {
        'oauth/authCheck': false,
        'oauth/authCode': false,
      },
    },
  };

  const mockAuthCheckSuccessResponse = {
    success: true,
    data: {
      show_notice: false,
      notice_list: [],
      site_type_match: true,
      user_site_type: '',
    },
  };

  beforeEach(() => {
    // 设置默认的 mock 返回值
    useSnackbar.mockReturnValue({ message: mockMessage });
    searchToJson.mockReturnValue({
      client_id: 'test_client_id',
      scope: 'test_scope',
      state: 'test_state',
      response_type: 'code',
      redirect_uri: 'http://test.com/callback',
    });
    memStorage.getItem.mockReturnValue('test_csrf');
    goVerifyLegacy.mockResolvedValue('test_token');
    addLangToPath.mockImplementation((path) => path);
    mockDispatch.mockResolvedValue(mockAuthCheckSuccessResponse);

    // 清除之前的 mock 调用记录
    jest.clearAllMocks();
  });

  it('应该正确渲染授权页面', () => {
    customRender(<Authorize userInfo={mockUserInfo} />, mockState);

    // 验证基本元素是否存在
    expect(screen.getByText('pkGhP4z3CsKczkJejUJ1RU')).toBeInTheDocument();
    expect(screen.getByText('3568xM5Xxp8mrcGSvfHMpQ')).toBeInTheDocument();
    expect(screen.getByText('4DKofv2eZrUxFLoPrLXwoq')).toBeInTheDocument();
    expect(screen.getByText('6pyGA8UUt9Zdtskyg3FF7n')).toBeInTheDocument();
  });

  it('同意复选框应该正常工作', () => {
    customRender(<Authorize userInfo={mockUserInfo} />, mockState);

    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByText('6pyGA8UUt9Zdtskyg3FF7n');

    // 初始状态下按钮应该被禁用
    expect(submitButton).toBeDisabled();

    // 点击复选框
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(submitButton).not.toBeDisabled();

    // 再次点击复选框
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(submitButton).toBeDisabled();
  });

  it('应该正确处理授权检查流程', async () => {
    const mockAuthCheckResponse = {
      success: true,
      data: {
        show_notice: false,
        notice_list: [],
        site_type_match: true,
        user_site_type: '',
      },
    };

    mockDispatch.mockImplementation((action) => {
      if (action.type === 'oauth/authCheck') {
        return Promise.resolve(mockAuthCheckResponse);
      }
      if (action.type === 'oauth/authCode') {
        return Promise.resolve({
          success: true,
          data: {
            location: 'http://test.com/success',
          },
        });
      }
      return Promise.resolve(mockAuthCheckSuccessResponse);
    });

    customRender(<Authorize userInfo={mockUserInfo} />, mockState);

    // 勾选同意复选框
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // 点击授权按钮
    const submitButton = screen.getByText('6pyGA8UUt9Zdtskyg3FF7n');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'oauth/authCheck',
        }),
      );
    });
  });

  it('应该正确处理站点类型不匹配的情况', async () => {
    const mockAuthCheckResponse = {
      success: true,
      data: {
        show_notice: false,
        notice_list: [],
        site_type_match: false,
        user_site_type: 'test_site',
      },
    };

    mockDispatch.mockImplementation((action) => {
      if (action.type === 'oauth/authCheck') {
        return Promise.resolve(mockAuthCheckResponse);
      }
      return Promise.resolve(mockAuthCheckSuccessResponse);
    });

    customRender(<Authorize userInfo={mockUserInfo} />, mockState);

    // 勾选同意复选框并点击授权
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    const submitButton = screen.getByText('6pyGA8UUt9Zdtskyg3FF7n');
    fireEvent.click(submitButton);

    await waitFor(() => {
      // 验证站点类型不匹配的模态框是否显示
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('应该正确处理错误情况', async () => {
    const mockError = new Error('测试错误');
    mockError.msg = '授权失败';
    goVerifyLegacy.mockRejectedValue(mockError);

    // 确保 authCheck 返回正确的格式
    mockDispatch.mockImplementation((action) => {
      if (action.type === 'oauth/authCheck') {
        return Promise.resolve(mockAuthCheckSuccessResponse);
      }
      return Promise.resolve({});
    });

    customRender(<Authorize userInfo={mockUserInfo} />, mockState);

    // 勾选同意复选框并点击授权
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    const submitButton = screen.getByText('6pyGA8UUt9Zdtskyg3FF7n');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith('授权失败');
    });
  });

  it('应该正确处理重新登录', () => {
    // 确保 authCheck 返回正确的格式
    mockDispatch.mockImplementation((action) => {
      if (action.type === 'oauth/authCheck') {
        return Promise.resolve(mockAuthCheckSuccessResponse);
      }
      return Promise.resolve({});
    });

    customRender(<Authorize userInfo={mockUserInfo} />, mockState);

    const reLoginButton = screen.getByText('wn2KhfMbdo6p3veVsc5Gki');
    fireEvent.click(reLoginButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'app/logout',
      }),
    );
  });

  it('应该正确处理注册跳转', () => {
    // 确保 authCheck 返回正确的格式
    mockDispatch.mockImplementation((action) => {
      if (action.type === 'oauth/authCheck') {
        return Promise.resolve(mockAuthCheckSuccessResponse);
      }
      return Promise.resolve({});
    });

    customRender(<Authorize userInfo={mockUserInfo} />, mockState);

    const signUpButton = screen.getByText('qHy6XJWBFKKigXS3GZ7LXG');
    fireEvent.click(signUpButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'app/logout',
      }),
    );
  });
});
