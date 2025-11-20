import React from 'react';

import Input from 'components/Common/Input';
import {customRender as render} from '../../setup';

describe('Input', () => {
  it('renders input', () => {
    const {getByPlaceholderText} = render(
      <Input placeholder="input here" onChange={() => {}} />,
    );
    expect(getByPlaceholderText('input here')).toBeTruthy();
  });

  it('calls onChange when text changes', () => {
    const onChange = jest.fn();
    render(<Input placeholder="input here" onChange={onChange} />);
  });

  it('supports numberMode', () => {
    const onChange = jest.fn();
    render(<Input placeholder="input here" onChange={onChange} numberMode />);
  });
});
