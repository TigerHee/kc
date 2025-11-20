import React from 'react';

import {Title} from 'components/Common/Title';
import {customRender as render} from '../../setup';

describe('Title', () => {
  it('renders title', () => {
    const {toJSON} = render(<Title>MyTitle</Title>);
    expect(toJSON()).toMatchSnapshot();
  });
});
