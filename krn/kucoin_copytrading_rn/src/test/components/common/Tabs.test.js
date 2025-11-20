import React from 'react';

import Tabs from 'components/Common/Tabs';
import {customRender as render} from '../../setup';

describe('Tabs', () => {
  const options = [
    {label: 'Tab1', value: '1'},
    {label: 'Tab2', value: '2'},
  ];

  it('renders tab options', () => {
    const {getByText} = render(
      <Tabs options={options} value="1" onChange={() => {}} />,
    );
    expect(getByText('Tab1')).toBeTruthy();
    expect(getByText('Tab2')).toBeTruthy();
  });

  it('calls onChange when tab pressed', () => {
    const onChange = jest.fn();
    const {getByText} = render(
      <Tabs options={options} value="1" onChange={onChange} />,
    );
  });

  it('applies style prop', () => {
    const {toJSON} = render(
      <Tabs
        options={options}
        value="1"
        onChange={() => {}}
        style={{backgroundColor: 'red'}}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
