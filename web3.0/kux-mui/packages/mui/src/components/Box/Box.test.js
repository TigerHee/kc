import React from 'react';
import { screen } from '@testing-library/react';
import { createRender } from '../../../test/test-utils';
import Box from './index';
import { breakpoints } from '../../config';

describe('Box component', () => {
  const { render } = createRender();
  test('renders children correctly', () => {
    render(
      <Box>
        <div data-testid="child-element">Child Element</div>
      </Box>,
    );
    const childElement = screen.getByTestId('child-element');
    expect(childElement).toBeInTheDocument();
  });

  test('applies className correctly', () => {
    const { container } = render(<Box className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('applies style correctly', () => {
    const { container } = render(<Box style={{ backgroundColor: 'red' }} />);
    expect(container.firstChild).toHaveStyle('background-color: red');
  });

  test('applies responsive styles correctly', () => {
    const { container } = render(
      <Box width="100vw" height="300px" background={{ sm: 'orange' }} />,
    );
    window.innerWidth = breakpoints.lg;
    window.dispatchEvent(new Event('resize'));
    expect(container.firstChild).toHaveStyle('background: orange');
  });
});
