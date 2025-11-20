/*
 * Owner: terry@kupotech.com
 */
import React from 'react';
import {withEffect} from 'components/$/ReferFriends/common/withEffect';
import { render, screen } from '@testing-library/react';

describe('withEffect', () => {

  it('should be called', () => {
    const component = <div>Hello, World</div>;
    const callback = jest.fn();
    const Render = withEffect(component, callback);
    render(<div>{Render}</div>);
    expect(screen.getByText('Hello, World')).toBeInTheDocument();
    expect(callback).toBeCalledTimes(1);
  });
});