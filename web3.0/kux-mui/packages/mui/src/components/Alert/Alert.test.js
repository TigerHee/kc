import React from 'react';
import { createRender, fireEvent } from '../../../test/test-utils';
import Alert from './index';

describe('Alert Component', () => {
  const { render } = createRender();

  it('renders correctly', () => {
    const { getByText } = render(<Alert title="Test Alert" description="This is a test alert" />);
    expect(getByText('Test Alert')).toBeInTheDocument();
    expect(getByText('This is a test alert')).toBeInTheDocument();
  });

  it('renders with correct type', () => {
    const { container } = render(<Alert type="error" title="Error Alert" />);

    expect(container.querySelector('.KuxAlert-root')).toHaveClass('KuxAlert-error');
  });

  it('renders with icon', () => {
    const { container } = render(<Alert showIcon title="Icon Alert" />);

    expect(container.querySelector('.KuxAlert-icon')).toBeInTheDocument();
  });

  it('renders without icon', () => {
    const { container } = render(<Alert showIcon={false} title="No Icon Alert" />);

    expect(container.querySelector('.KuxAlert-icon')).not.toBeInTheDocument();
  });

  it('handles close', () => {
    const handleClose = jest.fn();

    const { container } = render(<Alert closable onClose={handleClose} title="Closable Alert" />);

    fireEvent.click(container.querySelector('.KuxAlert-action').firstChild);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
