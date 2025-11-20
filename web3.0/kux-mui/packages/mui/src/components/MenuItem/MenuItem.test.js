import React from 'react';
import { MenuContext } from 'context/index';
import { createRender, fireEvent } from '../../../test/test-utils';
import MenuItem from './index';

describe('MenuItem', () => {
  const { render } = createRender();
  const mockOnSelect = jest.fn();
  const mockOnClick = jest.fn();
  const renderMenuItem = (props, selectedKeys = []) => {
    const menuContextValue = {
      selectedKeys,
      onSelect: mockOnSelect,
      size: 'default',
    };
    return render(
      <MenuContext.Provider value={menuContextValue}>
        <MenuItem eventKey="test" onClick={mockOnClick} {...props}>
          {' '}
          Test Item{' '}
        </MenuItem>
      </MenuContext.Provider>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = renderMenuItem();
    expect(getByText('Test Item')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const { getByText } = renderMenuItem();
    fireEvent.click(getByText('Test Item'));
    expect(mockOnSelect).toHaveBeenCalledWith('test');
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('renders with custom icon', () => {
    const CustomIcon = <span data-testid="custom-icon">Icon</span>;
    const { getByTestId } = renderMenuItem({ icon: CustomIcon });
    expect(getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders as selected when eventKey is in selectedKeys', () => {
    const { getByText } = renderMenuItem({}, ['test']);
    expect(getByText('Test Item')).toHaveClass('KuxMenuItem-selected');
  });

  it('renders with mini size', () => {
    const { queryByText } = render(
      <MenuContext.Provider
        value={{
          selectedKeys: [],
          onSelect: mockOnSelect,
          size: 'mini',
        }}
      >
        <MenuItem eventKey="test" onClick={mockOnClick}>
          Test Item
        </MenuItem>
      </MenuContext.Provider>,
    );
    expect(queryByText('Test Item')).toBeNull();
  });
});
