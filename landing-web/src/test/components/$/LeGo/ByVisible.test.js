/*
 * Owner: jesse.shao@kupotech.com
 */
import Visible from 'src/components/$/LeGo/hocs/ByVisible';
import { render, screen, fireEvent, act } from '@testing-library/react';

describe('Visible', () => {
  it('renders children when visible is true', () => {
    const { getByText } = render(
      <Visible visible={true}>
        <div>Hello World</div>
      </Visible>,
    );
    expect(getByText('Hello World')).toBeInTheDocument();
  });

  it('does not render children when visible is false', () => {
    const { container } = render(
      <Visible visible={false}>
        <div>Hello World</div>
      </Visible>,
    );
    expect(container.firstChild).toBeNull();
  });
});
