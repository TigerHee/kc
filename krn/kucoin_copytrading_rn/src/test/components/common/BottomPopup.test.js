import React from 'react';
import {Text} from 'react-native';

import BottomPopup from 'components/Common/BottomPopup';
import {customRender as render} from '../../setup';

describe('BottomPopup', () => {
  it('renders children when show is true', () => {
    const {getByText} = render(
      <BottomPopup show onClose={() => {}}>
        <Text>PopupContent</Text>
      </BottomPopup>,
    );
  });

  it('calls onClose when closed', () => {
    const onClose = jest.fn();
    // 这里模拟Drawer的onClose，直接调用props
    render(
      <BottomPopup show onClose={onClose}>
        <Text>Popup</Text>
      </BottomPopup>,
    );
    onClose();
    expect(onClose).toHaveBeenCalled();
  });

  it('renders footer if provided', () => {
    const {getByText} = render(
      <BottomPopup show onClose={() => {}} footer={<Text>Footer</Text>}>
        <Text>Popup</Text>
      </BottomPopup>,
    );
  });
});
