/*
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AbsoluteLoading from 'components/AbsoluteLoading';

describe('AbsoluteLoading', () => {
  test('renders the Spin component with the provided props', () => {
    const testProps = { spinning: true, size: 'large', 'data-testid': 'enlarge-img' };
    render(<AbsoluteLoading {...testProps} />);

    const spinElement = screen.queryByTestId('enlarge-img');
    expect(spinElement).toBeInTheDocument();
  });
});
