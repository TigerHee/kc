import React from 'react';
import { screen } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';
import { createRender } from '../../../test/test-utils';
import Empty from './index';

describe('Empty component', () => {
  const { render } = createRender();

  test('renders with default props', () => {
    render(<Empty data-testid="empty-box" />);
    const emptyRoot = screen.getByTestId('empty-box');
    expect(emptyRoot).toBeInTheDocument();
    const description = screen.getByText(/No records/i);
    expect(description).toBeInTheDocument();
  });

  test('renders with custom props', () => {
    const customProps = {
      size: 'small',
      name: 'network-error',
      description: 'Custom description',
      subDescription: 'Custom sub description'
    };
    render(<Empty {...customProps} data-testid="empty-box" />);
    const emptyRoot = screen.getByTestId('empty-box');
    expect(emptyRoot).toBeInTheDocument();
    const description = screen.getByText(/Custom description/i);
    expect(description).toBeInTheDocument();
    const subDescription = screen.getByText(/Custom sub description/i);
    expect(subDescription).toBeInTheDocument();
  });

  test('renders with different themes', () => {
    render(
      <ThemeProvider theme="dark">
        <Empty data-testid="empty-box" />
      </ThemeProvider>
    );
    const emptyRoot = screen.getByTestId('empty-box');
    expect(emptyRoot).toBeInTheDocument();
    expect(emptyRoot).toHaveClass('KuxEmpty-themeDark');
  });
})