import React from 'react';
import {fireEvent} from '@testing-library/react-native';

import Selector from 'components/Common/Selector';
import {customRender as render} from '../../setup';

describe('Selector', () => {
  const options = [
    {value: 'a', label: 'A'},
    {value: 'b', label: 'B'},
    {value: 'c', label: 'C'},
  ];

  it('renders title and options', () => {
    const {getByText} = render(
      <Selector
        title="TestTitle"
        options={options}
        value="a"
        onChange={() => {}}
      />,
    );
    expect(getByText('TestTitle')).toBeTruthy();
    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
    expect(getByText('C')).toBeTruthy();
  });

  it('supports single select', () => {
    const onChange = jest.fn();
    const {getByText} = render(
      <Selector title="" options={options} value="a" onChange={onChange} />,
    );
    fireEvent.press(getByText('B'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('supports multiple select', () => {
    const onChange = jest.fn();
    const {getByText} = render(
      <Selector
        title=""
        options={options}
        value={['a']}
        onChange={onChange}
        multiple
      />,
    );
    fireEvent.press(getByText('B'));
    expect(onChange).toHaveBeenCalledWith(['a', 'b']);
  });
});
