import React from 'react';
import {Text} from 'react-native';
import {fireEvent} from '@testing-library/react-native';

import Card from 'components/Common/Card';
import {customRender as render} from '../../setup';

describe('Card', () => {
  it('renders children', () => {
    const {getByText} = render(
      <Card>
        <Text>CardContent</Text>
      </Card>,
    );
    expect(getByText('CardContent')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const {getByText} = render(
      <Card onPress={onPress}>
        <Text>PressMe</Text>
      </Card>,
    );
    fireEvent.press(getByText('PressMe'));
    expect(onPress).toHaveBeenCalled();
  });

  it('applies style prop', () => {
    const {toJSON} = render(
      <Card style={{backgroundColor: 'red'}}>
        <Text>Styled</Text>
      </Card>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
