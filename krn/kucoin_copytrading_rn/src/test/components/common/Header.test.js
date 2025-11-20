import React from 'react';
import {Text} from 'react-native';

import Header from 'components/Common/Header';
import {customRender as render} from '../../setup';

describe('Header', () => {
  it('renders title', () => {
    const {getByText} = render(<Header title="MyTitle" />);
    expect(getByText('MyTitle')).toBeTruthy();
  });

  it('calls onPressBack when back button pressed', () => {
    const onPressBack = jest.fn();
    const {getAllByRole} = render(<Header onPressBack={onPressBack} />);
  });

  it('renders leftSlot and rightSlot', () => {
    const {getByText} = render(
      <Header leftSlot={<Text>Left</Text>} rightSlot={<Text>Right</Text>} />,
    );
    expect(getByText('Left')).toBeTruthy();
    expect(getByText('Right')).toBeTruthy();
  });
});
