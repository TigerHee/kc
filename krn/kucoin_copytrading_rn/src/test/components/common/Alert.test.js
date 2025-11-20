import React from 'react';

import Alert from 'components/Common/Alert';
import {customRender as render} from '../../setup';

describe('Alert', () => {
  it('renders message', () => {
    const {getByText} = render(<Alert message="Warning!" />);
    expect(getByText('Warning!')).toBeTruthy();
  });

  it('does not render if no message', () => {
    const {toJSON} = render(<Alert />);
    expect(toJSON()).toBe('\\');
  });

  it('applies style prop', () => {
    const {toJSON} = render(
      <Alert message="Styled" style={{backgroundColor: 'red'}} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
