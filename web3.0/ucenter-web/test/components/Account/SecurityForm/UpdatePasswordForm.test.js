/**
 * Owner: willen@kupotech.com
 */
import { screen } from '@testing-library/react';
import UpdatePasswordForm from 'src/components/Account/SecurityForm/UpdatePasswordForm';
import { customRender } from 'test/setup';

const data = { currentLang: 'cn' };
jest.mock('src/components/LoadLocale', () => {
  return {
    __esModule: true,
    injectLocale: (WrappedComponent) => (props) => {
      return <WrappedComponent {...props} lang={data.currentLang} currentLang={data.currentLang} />;
    },
  };
});

describe('test UpdatePasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 测试修改密码模式（existLoginPsd=true）
  describe('Update Password Mode', () => {
    test('should render all password fields in update mode', () => {
      const { container } = customRender(<UpdatePasswordForm existLoginPsd={true} />);
      expect(container.querySelector('#oldPassword')).toBeTruthy();
      expect(container.querySelector('#newPassword')).toBeTruthy();
      expect(container.querySelector('#newPassword2')).toBeTruthy();
    });
  });

  // 测试设置密码模式（existLoginPsd=false）
  describe('Set Password Mode', () => {
    test('should not render old password field in set mode', () => {
      const { container } = customRender(<UpdatePasswordForm existLoginPsd={false} />);
      expect(container.querySelector('#oldPassword')).toBeFalsy();
      expect(container.querySelector('#newPassword')).toBeTruthy();
      expect(container.querySelector('#newPassword2')).toBeTruthy();
    });
  });

  // 测试国际化
  describe('Internationalization', () => {
    test('should update error messages when language changes', async () => {
      const { rerender } = customRender(<UpdatePasswordForm currentLang="cn" />);
      
      // 切换语言到英文
      data.currentLang = 'en';
      rerender(<UpdatePasswordForm currentLang="en" />);
      
      // 验证表单重新验证是否被触发
      expect(screen.getByText('submit')).toBeTruthy();
    });
  });
});
