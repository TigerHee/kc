/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { createRender, fireEvent } from '../../../test/test-utils';
import Checkbox from './index';

const CheckboxGroup = Checkbox.Group;
const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

describe('Checkbox', () => {
  const { render } = createRender();

  it('should be checked when value is true', () => {
    const { getByTestId } = render(
      <Checkbox checked data-testid="my-checkbox">
        Checkbox
      </Checkbox>,
    );
    expect(getByTestId('my-checkbox').checked).toEqual(true);
  });

  it('its value should be change when click', () => {
    const { getByTestId } = render(<Checkbox data-testid="my-checkbox">Checkbox</Checkbox>);
    expect(getByTestId('my-checkbox').checked).toEqual(false);
    fireEvent.click(getByTestId('my-checkbox'));
    expect(getByTestId('my-checkbox').checked).toEqual(true);
  });

  it('when disabled is true, it is unclickable', () => {
    const { getByTestId } = render(
      <Checkbox data-testid="my-checkbox" disabled>
        Checkbox
      </Checkbox>,
    );
    expect(getByTestId('my-checkbox').checked).toEqual(false);
    fireEvent.click(getByTestId('my-checkbox'));
    expect(getByTestId('my-checkbox').checked).toEqual(false);
  });

  it('check render CheckboxGroup', () => {
    const { container } = render(<CheckboxGroup defaultValue={['Pear']} options={options} />);
    const allOptions = container.querySelectorAll('input');
    expect(allOptions.length).toEqual(options.length);

    const selectElement = [...allOptions].find((ele) => ele.value === 'Pear');
    expect(selectElement.checked).toEqual(true);
  });

  it('test indeterminate', () => {
    const { getByTestId } = render(
      <Checkbox indeterminate data-testid="my-checkbox">
        Check all
      </Checkbox>,
    );
  });
});
