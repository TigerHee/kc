import React from 'react';

import {ConfirmModal, ConfirmPopup} from 'components/Common/Confirm';
import {customRender as render} from '../../setup';

describe('Confirm', () => {
  it('renders ConfirmModal', () => {
    const {toJSON} = render(
      <ConfirmModal visible message="msg" onClose={() => {}} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders ConfirmPopup', () => {
    const {toJSON} = render(
      <ConfirmPopup visible message="msg" onClose={() => {}} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
