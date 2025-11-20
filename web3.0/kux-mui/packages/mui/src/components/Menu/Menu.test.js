import React from 'react';
import { createRender, fireEvent } from '../../../test/test-utils';
import Menu from './index';

describe('Menu component', () => {
  const { render } = createRender();
  it('renders Menu with default props', () => {
    const { container } = render(
      <Menu>
        <Menu.MenuItem key="1">Item 1</Menu.MenuItem>
        <Menu.MenuItem key="2">Item 2</Menu.MenuItem>
      </Menu>
    );
    expect(container.firstChild).toHaveClass('KuxMenu-root');
    expect(container.querySelectorAll('.KuxMenuItem-root').length).toBe(2);
  });

  it('handles onSelect callback', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <Menu onSelect={onSelect}>
        <Menu.MenuItem key="1">Item 1</Menu.MenuItem>
        <Menu.MenuItem key="2">Item 2</Menu.MenuItem>
      </Menu>
    );
    fireEvent.click(getByText('Item 1'));
    expect(onSelect).toHaveBeenCalledWith(['1']);
  });

  it('sets defaultSelectedKeys', () => {
    const { getByText } = render(
      <Menu defaultSelectedKeys={['2']}>
        <Menu.MenuItem key="1">Item 1</Menu.MenuItem>
        <Menu.MenuItem key="2">Item 2</Menu.MenuItem>
      </Menu>
    );
    expect(getByText('Item 2').closest('.KuxMenuItem-root')).toHaveClass('KuxMenuItem-selected');
  });

  it('updates selectedKeys when prop changes', () => {
    const { getByText, rerender } = render(
      <Menu selectedKeys={['1']}>
        <Menu.MenuItem key="1">Item 1</Menu.MenuItem>
        <Menu.MenuItem key="2">Item 2</Menu.MenuItem>
      </Menu>
    );
    expect(getByText('Item 1').closest('.KuxMenuItem-root')).toHaveClass('KuxMenuItem-selected');
    rerender(
      <Menu selectedKeys={['2']}>
        <Menu.MenuItem key="1">Item 1</Menu.MenuItem>
        <Menu.MenuItem key="2">Item 2</Menu.MenuItem>
      </Menu>
    );
    expect(getByText('Item 2').closest('.KuxMenuItem-root')).toHaveClass('KuxMenuItem-selected');
  });
});