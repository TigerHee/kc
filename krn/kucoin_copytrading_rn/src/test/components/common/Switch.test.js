import React from 'react';

import Switch from 'components/Common/Switch';
import {customRender as render} from '../../setup';

describe('Switch', () => {
  it('toggles value on press', () => {
    const onChange = jest.fn();
    render(<Switch checked={false} onChange={onChange} />);
  });

  it('applies custom checkedBg and unCheckedBg', () => {
    const {toJSON} = render(
      <Switch checked checkedBg="red" unCheckedBg="blue" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
