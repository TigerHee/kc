import React from 'react';
import { customRender } from 'test/setup';
import { fireEvent, screen } from '@testing-library/react';
import ConfirmModal from 'src/routes/OauthPage/Authorize/ConfirmModal';

jest.mock('tools/i18n', () => ({
  _t: (key) => key,
}));

jest.mock('@kux/mui', () => {
  const actual = jest.requireActual('@kux/mui');
  return {
    ...actual,
    useResponsive: () => ({ md: true }),
  };
});

describe('ConfirmModal Component', () => {
  const defaultProps = {
    visible: true,
    onCancel: jest.fn(),
    content: 'Test Content',
    onOK: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染模态框', () => {
    customRender(<ConfirmModal {...defaultProps} />, {});

    // 验证标题
    expect(screen.getByText('modal.title.notice')).toBeInTheDocument();

    // 验证内容
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    // 验证确认按钮
    expect(screen.getByText('ur3Pj4exTeKBPjCRcfryaB')).toBeInTheDocument();

    // 验证图片
    const img = screen.getByAltText('resultSuccess');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('resultSuccess.png');
  });

  it('应该在点击确认按钮时调用 onOK', () => {
    customRender(<ConfirmModal {...defaultProps} />, {});

    // 点击确认按钮
    fireEvent.click(screen.getByText('ur3Pj4exTeKBPjCRcfryaB'));

    // 验证回调
    expect(defaultProps.onOK).toHaveBeenCalled();
  });

  it('应该在 visible 为 false 时不显示模态框', () => {
    customRender(<ConfirmModal {...defaultProps} visible={false} />, {});

    // 验证模态框不在文档中
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('应该在移动端正确渲染', () => {
    // 修改 useResponsive 的返回值
    jest.spyOn(require('@kux/mui'), 'useResponsive').mockReturnValue({ md: false });

    customRender(<ConfirmModal {...defaultProps} />, {});

    // 验证模态框存在
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // 恢复 mock
    jest.spyOn(require('@kux/mui'), 'useResponsive').mockRestore();
  });

  it('应该正确显示自定义内容', () => {
    const customContent = '自定义提示内容';
    customRender(<ConfirmModal {...defaultProps} content={customContent} />, {});

    // 验证自定义内容显示
    expect(screen.getByText(customContent)).toBeInTheDocument();
  });

  it('应该正确处理多次点击确认按钮', () => {
    customRender(<ConfirmModal {...defaultProps} />, {});

    const button = screen.getByText('ur3Pj4exTeKBPjCRcfryaB');

    // 连续点击按钮
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    // 验证回调被调用正确的次数
    expect(defaultProps.onOK).toHaveBeenCalledTimes(3);
  });
});
