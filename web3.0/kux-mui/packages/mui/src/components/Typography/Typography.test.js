import React from 'react';
import { screen } from '@testing-library/react';
import { createRender } from '../../../test/test-utils';
import Typography from './index';

describe('Typography', () => {
  const { render } = createRender();

  test('renders Typography component with children', () => {
    render(<Typography>Test Text</Typography>);
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  test('renders Typography component with default variant', () => {
    render(<Typography>Test Text</Typography>);
    const typographyElement = screen.getByText('Test Text');
    expect(typographyElement.tagName).toBe('H1');
  });

  test('renders Typography component with specified variant', () => {
    render(<Typography variant="h3">Test Text</Typography>);
    const typographyElement = screen.getByText('Test Text');
    expect(typographyElement.tagName).toBe('H3');
  });

  test('renders Typography component with custom className', () => {
    render(<Typography className="custom-class">Test Text</Typography>);
    const typographyElement = screen.getByText('Test Text');
    expect(typographyElement).toHaveClass('custom-class');
  });

  test('renders Typography component with custom size', () => {
    render(<Typography size="22">Test Text</Typography>);
    const typographyElement = screen.getByText('Test Text');
    expect(typographyElement).toHaveStyle('font-size: 22px');
  });
});