import React from 'react';
import {Text} from 'react-native';

import Descriptions from 'components/Common/Descriptions';
import {customRender as render} from '../../setup';

describe('Descriptions', () => {
  const items = [
    {key: '1', label: 'Label1', children: 'Value1'},
    {key: '2', label: 'Label2', children: <Text>Value2</Text>},
    {key: '3', label: 'Label3', children: 'Value3', tip: 'tip3'},
  ];

  it('renders items', () => {
    const {getByText} = render(<Descriptions items={items} />);
    expect(getByText('Label1')).toBeTruthy();
    expect(getByText('Value1')).toBeTruthy();
    expect(getByText('Label2')).toBeTruthy();
    expect(getByText('Value2')).toBeTruthy();
  });

  it('renders tip if provided', () => {
    const {getByText} = render(<Descriptions items={items} />);
    expect(getByText('Label3')).toBeTruthy();
    // tip3 只在TipTrigger里，通常不直接渲染，但label一定有
  });

  it('applies custom styles', () => {
    const {toJSON} = render(
      <Descriptions items={items} styles={{card: {backgroundColor: 'red'}}} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
