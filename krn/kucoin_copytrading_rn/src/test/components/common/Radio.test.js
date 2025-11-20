import React from 'react';

import Radio from 'components/Common/Radio';
import {customRender as render} from '../../setup';

describe('Radio', () => {
  it('renders children text', () => {
    const {getByText} = render(<Radio>Option</Radio>);
    expect(getByText('Option')).toBeTruthy();
  });
});
