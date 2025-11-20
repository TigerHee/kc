/*
 * @Owner: jesse.shao@kupotech.com
 */
// import AntiDuplication from '@kp-toc/anti-duplication';
import Html from 'components/common/Html';
import React, { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

describe('Html component', () => {
  it('renders the children as inner HTML', () => {
    const { queryByText } = render(<Html>Hello, world</Html>);
    expect(queryByText('Hello, world')).toBeInTheDocument();
  });

  it('renders the specified component', () => {
    const { container } = render(<Html component="span">Hello</Html>);
    expect(container.firstChild.tagName.toLowerCase()).toBe('span');
  });

  it('passes through other props', () => {
    const { container } = render(<Html id="test">Hello</Html>);
    expect(container.firstChild.getAttribute('id')).toBe('test');
  });
});
