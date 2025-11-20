import React from 'react';
import { createRender, fireEvent } from '../../../test/test-utils';
import Dropdown from './index';

describe('Dropdown', () => {
  const { render } = createRender();

  it('opens and closes the dropdown on click', () => {
    const handleVisibleChange = jest.fn();

    const { getByText, queryByText } = render(
      <Dropdown onVisibleChange={handleVisibleChange} overlay={<div>Menu</div>}>
        <button type="button">Trigger</button>
      </Dropdown>,
    );

    // 确保初始状态下菜单是关闭的
    expect(queryByText('Menu')).toBeNull();

    // 模拟点击触发器
    fireEvent.click(getByText('Trigger'));

    // 确保菜单已打开
    expect(getByText('Menu')).toBeInTheDocument();

    expect(handleVisibleChange).toHaveBeenCalledWith(true);

    // 再次点击触发器
    fireEvent.click(getByText('Trigger'));

    // 确保菜单已关闭
    expect(queryByText('Menu')).toBeNull();

    expect(handleVisibleChange).toHaveBeenCalledWith(false);
  });
});
