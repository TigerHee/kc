import React from 'react';
import { screen } from '@testing-library/react';
import { createRender } from '../../../test/test-utils';
import Spin from './index';

describe('Spin', () => {
  const { render } = createRender();
  test('renders without crashing', () => {
    render(<Spin />);
  });

  test('renders spinning state correctly', () => {
    const { rerender } = render(<Spin data-testid="spin-box" spinning={true} />);
    expect(screen.getByTestId('spin-box')).toBeInTheDocument();
    rerender(<Spin spinning={false} />);
    expect(screen.queryByTestId('spin-box')).not.toBeInTheDocument();
  });

  test('renders correct size', () => {
    render(<Spin data-testid="spin-box" size="basic" />);
    expect(screen.getByTestId('spin-box')).toHaveClass('KuxSpin-basicSpin');
    render(<Spin data-testid="spin-box1" size="small" />);
    expect(screen.getByTestId('spin-box1')).toHaveClass('KuxSpin-smallSpin');
  });

  test('renders children correctly', () => {
    render(<Spin><div data-testid="child-element">Child Element</div></Spin>);
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });
});