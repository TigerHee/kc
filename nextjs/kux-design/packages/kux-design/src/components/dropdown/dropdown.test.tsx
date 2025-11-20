/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Dropdown } from './index';

describe('Dropdown', () => {
  it('opens and closes the dropdown on click', () => {
    render(
      <Dropdown overlay={<div>Menu</div>} trigger="click">
        <button type="button">Trigger</button>
      </Dropdown>,
    );

    // 确保初始状态下菜单是关闭的
    expect(screen.queryByText('Menu')).toBeNull();

    // 模拟点击触发器
    fireEvent.click(screen.getByText('Trigger'));

    // 确保菜单已打开
    expect(screen.getByText('Menu')).toBeInTheDocument();

    // 再次点击触发器
    fireEvent.click(screen.getByText('Trigger'));

    // 确保菜单已关闭
    expect(screen.queryByText('Menu')).toBeNull();
  });

  it('opens on hover when trigger is hover', () => {
    render(
      <Dropdown 
        trigger="hover" 
        overlay={<div>Menu</div>}
      >
        <button type="button">Trigger</button>
      </Dropdown>,
    );

    // 确保初始状态下菜单是关闭的
    expect(screen.queryByText('Menu')).toBeNull();

    // 模拟悬停触发器
    fireEvent.mouseOver(screen.getByText('Trigger'));

    // 确保菜单已打开
    expect(screen.getByText('Menu')).toBeInTheDocument();

    // 模拟离开触发器
    fireEvent.mouseLeave(screen.getByText('Trigger'));

    // 确保菜单已关闭
    expect(screen.queryByText('Menu')).toBeNull();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <Dropdown 
        overlay={<div>Menu</div>}
        className="custom-dropdown"
      >
        <button type="button">Trigger</button>
      </Dropdown>,
    );

    expect(container.firstChild).toHaveClass('custom-dropdown');
  });

  it('renders with custom style', () => {
    const { container } = render(
      <Dropdown 
        overlay={<div>Menu</div>}
        style={{ backgroundColor: 'red' }}
      >
        <button type="button">Trigger</button>
      </Dropdown>,
    );

    expect(container.firstChild).toHaveStyle({ backgroundColor: 'red' });
  });

  it('renders overlay content correctly', () => {
    const overlayContent = (
      <div>
        <div className="kux-dropdown__item">Item 1</div>
        <div className="kux-dropdown__item">Item 2</div>
      </div>
    );

    render(
      <Dropdown overlay={overlayContent}>
        <button type="button">Trigger</button>
      </Dropdown>,
    );

    // 点击触发器显示菜单
    fireEvent.click(screen.getByText('Trigger'));

    // 确保菜单项正确渲染
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
}); 