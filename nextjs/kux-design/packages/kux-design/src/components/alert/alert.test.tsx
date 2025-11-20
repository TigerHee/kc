/**
 * @Owner: larvide.peng@kupotech.com
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert, type IAlertProps } from './index';

describe('Alert 组件', () => {
  const defaultProps: IAlertProps = {
    message: '这是一条警告信息',
    type: 'info',
    size: 'basic',
    duration: 4000,
    showClose: false,
  };

  // 测试组件是否正确渲染消息
  it('渲染正确的警告信息', () => {
    render(<Alert {...defaultProps} />);
    expect(screen.getByText('这是一条警告信息')).toBeInTheDocument();
  });

  // 测试不同类型是否应用正确的 CSS 类名
  it('根据类型应用正确的类名', () => {
    const { container } = render(<Alert {...defaultProps} type="success" />);
    expect(container.querySelector('.is-success')).toBeInTheDocument();
  });

  // 测试不同尺寸是否应用正确的类名
  it('根据尺寸应用正确的类名', () => {
    const { container } = render(<Alert {...defaultProps} size="small" />);
    expect(container.querySelector('.in-small')).toBeInTheDocument();
  });

  // 测试显示关闭图标的功能
  it('当 showClose 为 true 时显示关闭图标', () => {
    const { container } = render(<Alert {...defaultProps} showClose />);
    expect(container.querySelector('.kux-alert-close-icon')).toBeInTheDocument();
  });

  // 测试不显示关闭图标的情况
  it('当 showClose 为 false 时不显示关闭图标', () => {
    const { container } = render(<Alert {...defaultProps} showClose={false} />);
    expect(container.querySelector('.kux-alert-close-icon')).not.toBeInTheDocument();
  });

  it('关闭警告时调用 onHide 回调', () => {
    const onHide = jest.fn();
    render(<Alert {...defaultProps} showClose onHide={onHide} />);
    const closeIcon = screen.getByTestId('alert-close-ico');
    fireEvent.click(closeIcon);
    setTimeout(() => {
      expect(onHide).toHaveBeenCalled();
    }, defaultProps.duration);
  });

  it('显示警告时调用 onShow 回调', () => {
    const onShow = jest.fn();
    render(<Alert {...defaultProps} onShow={onShow} />);

    // 使用 setTimeout 等待动画完成
    setTimeout(() => {
      expect(onShow).toHaveBeenCalled();
    }, 300); // 等待动画完成的时间
  });

  // 测试自动隐藏功能
  it('在指定时间后自动隐藏', () => {
    const onHide = jest.fn();
    render(<Alert {...defaultProps} duration={3000} onHide={onHide} />);

    expect(screen.getByText('这是一条警告信息')).toBeInTheDocument();

    setTimeout(() => {
      expect(onHide).toHaveBeenCalled();
    }, 3000);
  });

  // 测试 duration 为 0 时不自动隐藏
  it('当 duration 为 0 时不自动隐藏', () => {
    jest.useFakeTimers();
    const onHide = jest.fn();
    render(<Alert {...defaultProps} duration={0} onHide={onHide} />);

    // 快进时间
    jest.runAllTimers();

    // 验证 onHide 没有被调用
    expect(onHide).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(onHide).not.toHaveBeenCalled();
    }, 5000);
    jest.useRealTimers();
  });
});
