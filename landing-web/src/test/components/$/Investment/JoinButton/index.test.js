/*
 * Owner: terry@kupotech.com
 */
import React from 'react';
import JoinButton from 'components/$/Investment/JoinButton';
import { render } from '@testing-library/react';

describe('JoinButton', () => {

  it('should render success', () => {
    const {container} = render(
      <JoinButton />
    )
    expect(container.querySelector('[inspector="join_btn"]')).toBeInTheDocument();
  });
});