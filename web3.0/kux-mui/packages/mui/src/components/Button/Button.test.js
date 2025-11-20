import React from 'react';
import { screen } from '@testing-library/react';
import { createRender, fireEvent } from '../../../test/test-utils';
import Button from './index';

describe('Button', () => {
  const { render } = createRender();

  test('renders button with children', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  test('renders loading icon when loading prop is true', () => {
    render(<Button loading>Test Button</Button>);
    expect(screen.getByText('Test Button')).toHaveClass('KuxButton-loading');
  });

  test('renders startIcon when provided', () => {
    const startIcon = <div data-testid="start-icon">Icon</div>;
    render(<Button startIcon={startIcon}>Test Button</Button>);
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  test('renders endIcon when provided', () => {
    const endIcon = <div data-testid="end-icon">Icon</div>;
    render(<Button endIcon={endIcon}>Test Button</Button>);
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Test Button</Button>);
    fireEvent.click(screen.getByText('Test Button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not trigger click event when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Test Button</Button>);
    fireEvent.click(screen.getByText('Test Button'));
    expect(handleClick).toHaveBeenCalledTimes(0);
  });

  test('applies the correct styles for different variants', () => {
    const { rerender } = render(<Button variant="contained">Test Button</Button>);
    expect(screen.getByText('Test Button')).toHaveClass('KuxButton-contained');
    rerender(<Button variant="outlined">Test Button</Button>);
    expect(screen.getByText('Test Button')).toHaveClass('KuxButton-outlined');
    rerender(<Button variant="text">Test Button</Button>);
    expect(screen.getByText('Test Button')).toHaveClass('KuxButton-text');
  });

  test('applies the correct styles for different sizes', () => {
    const { rerender } = render(<Button size="basic">Test Button</Button>);
    expect(screen.getByText('Test Button')).toHaveClass('KuxButton-sizeBasic');
    rerender(<Button size="large">Test Button</Button>);
    expect(screen.getByText('Test Button')).toHaveClass('KuxButton-sizeLarge');
    rerender(<Button size="small">Test Button</Button>);
    expect(screen.getByText('Test Button')).toHaveClass('KuxButton-sizeSmall');
    rerender(<Button size="mini">Test Button</Button>);
    expect(screen.getByText('Test Button')).toHaveClass('KuxButton-sizeMini');
  });

  test('applies the correct styles for different types', () => {
    const { rerender } = render(<Button type="primary">Test Button</Button>);
    expect(screen.getByText('Test Button')).toHaveClass('KuxButton-containedPrimary');
    rerender(<Button type="default">Test Button</Button>);
    expect(screen.getByText('Test Button')).toHaveClass('KuxButton-containedDefault');
    rerender(<Button type="secondary">Test Button</Button>);
    expect(screen.getByText('Test Button')).toHaveClass('KuxButton-containedSecondary');
  });
});