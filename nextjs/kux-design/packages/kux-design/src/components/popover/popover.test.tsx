import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './index';

describe('popover', () => {
  test('渲染 Popover', () => {
    render(
      <Popover placement="top" content="Test Content">
        <button>Hover me</button>
      </Popover>,
    );
  });

  test('当 trigger 为 hover 时，悬停显示内容', async () => {
    const { getByText, queryByText } = render(
      <Popover placement="top" content="Test Content" trigger="hover">
        <button>Hover me</button>
      </Popover>,
    );

    expect(queryByText('Test Content')).toBeNull();

    const button = getByText('Hover me');
    userEvent.hover(button);

    const content = await waitFor(() => getByText('Test Content'));
    expect(content).toBeInTheDocument();
  });

  test('当 trigger 为 hover 时，离开隐藏内容', async () => {
    const { getByText, queryByText } = render(
      <Popover placement="top" content="Test Content" trigger="hover">
        <button>Hover me</button>
      </Popover>,
    );

    const button = getByText('Hover me');
    userEvent.hover(button);

    const content = await waitFor(() => getByText('Test Content'));
    expect(content).toBeInTheDocument();

    userEvent.unhover(button);

    await waitFor(() => expect(queryByText('Test Content')).toBeNull());
  });

  test('当 trigger 为 click 时，点击切换内容', async () => {
    const { getByText, queryByText } = render(
      <Popover placement="top" content="Test Content" trigger="click">
        <button>Click me</button>
      </Popover>,
    );

    const button = getByText('Click me');
    userEvent.click(button);

    const content = await waitFor(() => getByText('Test Content'));
    expect(content).toBeInTheDocument();

    userEvent.click(button);
    await waitFor(() => expect(queryByText('Test Content')).toBeNull());
  });

  test('当 trigger 为 persist 时，始终显示内容', () => {
    const { getByText } = render(
      <Popover placement="top" content="Test Content" trigger="persist">
        <button>Persisted Popover</button>
      </Popover>,
    );

    const content = getByText('Test Content');
    expect(content).toBeInTheDocument();
  });

  test('在 RTL 模式下正确更改位置', () => {
    jest.mock('@/hooks/useDir', jest.fn(() => 'rtl'));

    const { getByTestId } = render(
      <Popover placement="left" content="Test Content" trigger='persist'>
        <button>Hover me</button>
      </Popover>,
    );

    const popoverElement = getByTestId('kux-popover-content');
    expect(popoverElement).toHaveAttribute('data-placement', 'left');
  });

  test('根据 showArrow 属性显示或隐藏箭头', async () => {
    const { queryAllByTestId, getAllByTestId, getByText, rerender } = render(
      <Popover placement="top" content="Test Content" showArrow={true} trigger='hover'>
        <button>Show Arrow</button>
      </Popover>,
    );

    userEvent.hover(getByText('Show Arrow'));
    const arrow = await waitFor(() => getAllByTestId('kux-popover-arrow'));
    expect(arrow).toHaveLength(1);

    rerender(
      <Popover placement="top" content="Test Content" showArrow={false} trigger='hover'>
        <button>Show Arrow</button>
      </Popover>,
    );
    userEvent.hover(getByText('Show Arrow'));
    await waitFor(() => expect(queryAllByTestId('kux-popover-arrow')).toHaveLength(0));
  });
});
