import React from 'react';
import { screen } from '@testing-library/react';
import { createRender, fireEvent, userEvent } from '../../../test/test-utils';
import Input from './index';

describe('Input component', () => {
  const { render } = createRender();
  test('renders input with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('renders input with label', () => {
    render(<Input label="Test Label" />);
    const label = document.querySelector('.KuxInput-label');
    expect(label).toBeInTheDocument();
    expect(label.innerHTML).toBe('Test Label');
  });

  test('handles input change', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('handles input focus and blur', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('handles input clear', async () => {
    const handleChange = jest.fn();
    const { container } = render(<Input allowClear onChange={handleChange} value={2} />);
    const input = container.querySelector('input');
    await userEvent.type(input, 'World!');
    expect(input).toHaveValue('2World!');
    const clearIcon = container.querySelector('.KuxInput-clearIcon');
    fireEvent.click(clearIcon);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('2');
  });

  test('renders input with error', () => {
    render(<Input error />);
    const error = document.querySelector('.KuxInput-error');
    expect(error).toBeInTheDocument();
  });

  test('renders input with disabled', () => {
    render(<Input disabled />);
    const disabled = document.querySelector('.KuxInput-disabled');
    expect(disabled).toBeInTheDocument();
  });

  test('renders input with custom size', () => {
    render(<Input size="xlarge" />);
    const xlarge = document.querySelector('.KuxInput-sizeXlarge');
    expect(xlarge).toBeInTheDocument();
  });

  test('renders input with prefix', () => {
    render(<Input prefix={<span>prefix</span>} />);
    const prefix = document.querySelector('.KuxInput-prefix');
    expect(prefix).toBeInTheDocument();
  });

  test('renders input with suffix', () => {
    render(<Input suffix={<span>suffix</span>} />);
    const suffix = document.querySelector('.KuxInput-suffix');
    expect(suffix).toBeInTheDocument();
  });

  test('renders input with password type', () => {
    render(<Input type="password" />);
    const type = document.querySelector('.KuxInput-typePassword');
    expect(type).toBeInTheDocument();
  });
});
