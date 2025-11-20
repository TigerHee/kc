import React from 'react';
import { screen } from '@testing-library/react';
import { createRender } from '../../../test/test-utils';
import Divider from './index';

describe('Divider', () => {
  const { render } = createRender();

  test('renders horizontal divider without children', () => {
    const { container } = render(<Divider type="horizontal" />);
    expect(container.firstChild).toHaveClass('KuxDivider-horizontal');
  });

  test('renders vertical divider without children', () => {
    const { container } = render(<Divider type="vertical" />);
    expect(container.firstChild).toHaveClass('KuxDivider-vertical');
  });

  test('renders horizontal divider with children', () => {
    const { container } = render(
      <Divider type="horizontal" orientation="center">
        Test Content
      </Divider>
    );
    expect(container.firstChild).toHaveClass('KuxDivider-horizontal');
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders horizontal divider with left orientation', () => {
    const { container } = render(
      <Divider type="horizontal" orientation="left">
        Test Content
      </Divider>
    );
    expect(container.firstChild).toHaveClass('KuxDivider-horizontal');
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('KuxDivider-left');
  });

  test('renders horizontal divider with right orientation', () => {
    const { container } = render(
      <Divider type="horizontal" orientation="right">
        Test Content
      </Divider>
    );
    expect(container.firstChild).toHaveClass('KuxDivider-horizontal');
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('KuxDivider-right');
  });

  test('renders divider with custom className', () => {
    const { container } = render(<Divider type="horizontal" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});