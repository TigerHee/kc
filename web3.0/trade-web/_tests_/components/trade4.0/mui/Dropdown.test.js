import React from 'react';
import { fireEvent, cleanup } from '@testing-library/react';
import MuiDropdown, { DropdownOverlayClose } from 'src/trade4.0/components/mui/Dropdown.js';
import { useResponsive } from '@kux/mui';
import { renderWithTheme } from '_tests_/test-setup';

afterEach(cleanup);

// Mock the external hooks and libraries
jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useResponsive: jest.fn(),
}));

describe('MuiDropdown', () => {
  it('renders correctly', () => {
    useResponsive.mockReturnValue({ sm: true });
    const {
      wrapper: { getByText },
    } = renderWithTheme(
      <MuiDropdown title="Test title" overlay={<div>abc</div>}>
        Test
      </MuiDropdown>,
    );
    expect(getByText('Test')).toBeInTheDocument();
  });

  it('renders correctly', () => {
    useResponsive.mockReturnValue({ sm: false });
    const {
      wrapper: { getByText },
    } = renderWithTheme(
      <MuiDropdown title="Test title" overlay={<div>abc</div>}>
        Test
      </MuiDropdown>,
    );
    expect(getByText('Test')).toBeInTheDocument();
  });

  it('calls onVisibleChange when clicked', () => {
    useResponsive.mockReturnValue({ sm: true });
    const mockFn = jest.fn();
    const {
      wrapper: { getByText },
    } = renderWithTheme(
      <MuiDropdown onVisibleChange={mockFn} overlay={<div>abc</div>}>
        Test
      </MuiDropdown>,
    );
    fireEvent.click(getByText('Test'));
    expect(mockFn).toHaveBeenCalledWith(true);
  });

});

describe('DropdownOverlayClose', () => {
  it('renders correctly', () => {
    const {
      wrapper: { getByText },
    } = renderWithTheme(<DropdownOverlayClose overlay={<div>abc</div>}>Test</DropdownOverlayClose>);
    expect(getByText('Test')).toBeInTheDocument();
  });

  it('calls onVisibleChange when clicked', () => {
    const mockFn = jest.fn();
    const {
      wrapper: { getByText },
    } = renderWithTheme(
      <DropdownOverlayClose onVisibleChange={mockFn} overlay={<div>abc</div>}>
        Test
      </DropdownOverlayClose>,
    );
    fireEvent.click(getByText('Test'));
    expect(mockFn).toHaveBeenCalledWith(true);
  });
});
