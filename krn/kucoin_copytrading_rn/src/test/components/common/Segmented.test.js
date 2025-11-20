import React from 'react';
import {fireEvent} from '@testing-library/react-native';

import Segmented from 'components/Common/Segmented';
import {customRender as render} from '../../setup';

describe('Segmented', () => {
  const options = [
    {label: 'A', value: 'a'},
    {label: 'B', value: 'b'},
  ];

  it('renders options', () => {
    const {getByText} = render(
      <Segmented options={options} initialValue="a" />,
    );
    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
  });

  it('changes selected index on press', () => {
    const {getByText} = render(
      <Segmented options={options} initialValue="a" />,
    );
    fireEvent.press(getByText('B'));
    expect(getByText('B')).toBeTruthy(); // 选中B
  });

  it('respects initialValue', () => {
    const {getByText} = render(
      <Segmented options={options} initialValue="b" />,
    );
    expect(getByText('B')).toBeTruthy();
  });
});
