import { fireEvent, screen } from '@testing-library/react';
import SelectDropdown from 'src/components/Account/Overview/SelectDropdown';
import { customRender } from 'test/setup';

// 用于模拟 Dropdown 组件的可见性控制
jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  Dropdown: ({ children, overlay, visible, onVisibleChange }) => (
    <div onMouseEnter={() => onVisibleChange(true)} onMouseLeave={() => onVisibleChange(false)}>
      {children}
      {visible && <div data-testid="dropdown-overlay">{overlay}</div>}
    </div>
  ),
}));

describe('test SelectDropdown', () => {
  test('renders SelectDropdown with no options', () => {
    customRender(<SelectDropdown options={[]}>SelectDropdown</SelectDropdown>, {});
    expect(screen.getByText('SelectDropdown')).toBeInTheDocument();
    fireEvent.click(screen.getByText('SelectDropdown'));
    expect(screen.queryByTestId('dropdown-overlay')).not.toBeInTheDocument();
  });

  test('renders SelectDropdown with options and handles clicks', () => {
    const handleChange = jest.fn();
    customRender(
      <SelectDropdown
        options={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ]}
        activeValue="1"
        onChange={handleChange}
      >
        SelectDropdown
      </SelectDropdown>,
      {},
    );

    expect(screen.getByText('SelectDropdown')).toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByText('SelectDropdown'));
    expect(screen.getByTestId('dropdown-overlay')).toBeInTheDocument();

    const option1 = screen.getByText('Option 1');
    const option2 = screen.getByText('Option 2');

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();

    fireEvent.click(option2);
    expect(handleChange).toHaveBeenCalledWith('2');
    expect(handleChange).toHaveBeenCalledTimes(1);

    expect(screen.queryByTestId('dropdown-overlay')).not.toBeInTheDocument();
  });

  test('handles visibility correctly on hover trigger', () => {
    const handleChange = jest.fn();
    customRender(
      <SelectDropdown
        options={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ]}
        activeValue="1"
        onChange={handleChange}
      >
        SelectDropdown
      </SelectDropdown>,
      {},
    );
    fireEvent.mouseEnter(screen.getByText('SelectDropdown'));
    expect(screen.getByTestId('dropdown-overlay')).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByText('SelectDropdown'));
    expect(screen.queryByTestId('dropdown-overlay')).not.toBeInTheDocument();
  });
});
