import { render, fireEvent } from '@testing-library/react';
import Checkbox from './checkbox';
import { CheckboxGroup } from './group';

describe('Checkbox', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(<Checkbox>测试</Checkbox>);
    expect(getByText('测试')).toBeInTheDocument();
  });

  it('calls onChange when clicked', () => {
    const handleChange = jest.fn();
    const { getByRole } = render(<Checkbox onChange={handleChange}>测试</Checkbox>);
    const input = getByRole('checkbox');
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalled();
  });

  it('respects checked prop (controlled)', () => {
    const { getByRole, rerender } = render(<Checkbox checked={false}>测试</Checkbox>);
    const input = getByRole('checkbox') as HTMLInputElement;
    expect(input.checked).toBe(false);
    rerender(<Checkbox checked={true}>测试</Checkbox>);
    expect(input.checked).toBe(true);
  });

  it('respects defaultChecked prop (uncontrolled)', () => {
    const { getByRole } = render(<Checkbox defaultChecked>测试</Checkbox>);
    const input = getByRole('checkbox') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(<Checkbox disabled>测试</Checkbox>);
    const input = getByRole('checkbox') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('applies custom className', () => {
    const { container } = render(<Checkbox className="custom-class">测试</Checkbox>);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});

describe('CheckboxGroup', () => {
  it('renders options correctly', () => {
    const { getByText } = render(
      <CheckboxGroup options={['A', 'B', 'C']} defaultValue={['A']} />
    );
    expect(getByText('A')).toBeInTheDocument();
    expect(getByText('B')).toBeInTheDocument();
    expect(getByText('C')).toBeInTheDocument();
  });

  it('calls onChange with correct values', () => {
    const handleChange = jest.fn();
    const { getByLabelText } = render(
      <CheckboxGroup
        options={['A', 'B']}
        onChange={handleChange}
        defaultValue={['A']}
      />
    );
    const bCheckbox = getByLabelText('B');
    fireEvent.click(bCheckbox);
    expect(handleChange).toHaveBeenCalledWith(['A', 'B']);
    fireEvent.click(bCheckbox);
    expect(handleChange).toHaveBeenCalledWith(['A']);
  });

  it('disables all checkboxes when disabled', () => {
    const { getAllByRole } = render(
      <CheckboxGroup options={['A', 'B']} disabled />
    );
    const inputs = getAllByRole('checkbox') as HTMLInputElement[];
    expect(inputs.length).toBeGreaterThanOrEqual(2);
    expect(inputs[0]?.disabled).toBe(true);
    expect(inputs[1]?.disabled).toBe(true);
  });
});