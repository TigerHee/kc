/*
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { render } from '@testing-library/react';
import Empty from 'components/$/LeGo/components/Empty';

describe('Empty Component', () => {
  test('renders successfully', () => {
    const { container } = render(<Empty />);
    
    expect(container).toBeInTheDocument();
  });
});