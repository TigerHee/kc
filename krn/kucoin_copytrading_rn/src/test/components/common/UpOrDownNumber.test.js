import React from 'react';

import {Number, Percent} from 'components/Common/UpOrDownNumber';
import {customRender as render} from '../../setup';
const state = {
  futures: {
    futuresCurrenciesMap: {},
  },
};

describe('UpOrDownNumber', () => {
  it('renders Percent', () => {
    const {toJSON} = render(<Percent value={0.5} />, state);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders Number', () => {
    const {toJSON} = render(<Number value={123} />, state);
    expect(toJSON()).toMatchSnapshot();
  });
});
