/*
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { render as renderDom, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import Portal from 'components/Portal';

describe('Portal', () => {
  it('removes container element when component is unmounted', () => {
    act(() => {
      render(<Portal content={<div>Test Content</div>} />);
    });
    expect(screen.queryByText('Test Content')).toBeInTheDocument();
  });

  it('removes container element when component is unmounted2', () => {
    const { unmount } = render(<Portal content={<div>Test Content22</div>} />);
    unmount();
    expect(screen.queryByText('Test Content22')).toBeFalsy();
  });

  it('removes container element when component is toBeFalsy', () => {
    act(() => {
      render(<Portal content={null} />);
    });
    expect(screen.queryByText('Test Content')).toBeFalsy();
  });
});
