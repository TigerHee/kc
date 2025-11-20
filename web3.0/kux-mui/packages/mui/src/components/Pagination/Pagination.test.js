import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRender, fireEvent } from '../../../test/test-utils';
import Pagination from './index';

describe('Pagination', () => {
  const { render } = createRender();

  it('renders Pagination component', () => {
    render(<Pagination total={50} />);
    expect(screen.getByLabelText('pagination navigation')).toBeInTheDocument();
  });

  it('renders Pagination with default props', () => {
    render(<Pagination />);
    expect(screen.getByLabelText('pagination navigation')).toBeInTheDocument();
  });

  it('changes page when a page item is clicked', () => {
    const mockOnChange = jest.fn();
    render(<Pagination total={50} onChange={mockOnChange} />);

    const page1 = screen.getByText('2');
    userEvent.click(page1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('does not change page when a disabled item is clicked', () => {
    const mockOnChange = jest.fn();
    const { container } = render(<Pagination total={50} onChange={mockOnChange} />);
    const prevButton = container.querySelector("[data-item='previous']");
    fireEvent.click(prevButton, { button: 0, bubbles: true });
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('displays total number of pages', () => {
    render(<Pagination total={50} showTotal={(total) => `Total Pages: ${total}`} />);
    expect(screen.getByText('Total Pages: 50')).toBeInTheDocument();
  });

  it('changes page when inputting a page number and pressing Enter', async () => {
    const mockOnChange = jest.fn();
    render(<Pagination total={50} showJumpQuick onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    userEvent.type(input, '3');
    userEvent.type(input, '{enter}');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
