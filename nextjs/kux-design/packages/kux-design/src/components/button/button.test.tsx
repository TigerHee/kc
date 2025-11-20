
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Button } from './index';

jest.mock('@/components/spin', () => ({
  __esModule: true,
  Spin: () => <div data-testid="kux-spin" />
}));

jest.mock('@/hooks', () => ({
  useSingletonCallback: (onClick: any) => [onClick, false]
}));

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('kux-button-content');
  });

  it('renders with custom type', () => {
    render(<Button type="primary">Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toHaveClass('kux-button-content');
  });

  it('renders with custom size', () => {
    render(<Button size="large">Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toHaveClass('kux-button-content-large');
  });

  it('renders with startIcon', () => {
    render(<Button startIcon={<span>Icon</span>}>Click Me</Button>);
    const iconElement = screen.getByText(/Icon/i);
    expect(iconElement).toBeInTheDocument();
  });

  it('renders with endIcon', () => {
    render(<Button endIcon={<span>Icon</span>}>Click Me</Button>);
    const iconElement = screen.getByText(/Icon/i);
    expect(iconElement).toBeInTheDocument();
  });

  it('renders with disabled prop', () => {
    render(<Button disabled={true}>Click Me</Button>);
    const buttonElement = screen.getByTestId('kux-button');
    expect(buttonElement).toBeDisabled();
  });

  it('renders with loading prop', () => {
    render(<Button loading={true}>Click Me</Button>);
    const buttonElement = screen.getByTestId('kux-button');
    expect(buttonElement).toBeDisabled();
    const spinnerElement = screen.getByTestId('loading-ico');
    expect(spinnerElement).toBeInTheDocument();
  });

  it('renders with fullWidth prop', () => {
    render(<Button fullWidth>Click Me</Button>);
    const buttonElement = screen.getByTestId('kux-button');
    expect(buttonElement).toHaveClass('is-full-width');
  });

  it('renders with block prop', () => {
    render(<Button block>Click Me</Button>);
    const buttonElement = screen.getByTestId('kux-button');
    expect(buttonElement).toHaveClass('kux-button-full');
  });

  it('renders with href prop', () => {
    render(<Button href="https://example.com">Click Me</Button>);
    const linkElement = screen.getByRole('link', { name: /Click Me/i });
    expect(linkElement).toHaveAttribute('href', 'https://example.com');
  });

  it('renders with custom className', () => {
    render(<Button className="custom-class">Click Me</Button>);
    const buttonElement = screen.getByTestId('kux-button');
    expect(buttonElement).toHaveClass('custom-class');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button type="primary" onClick={handleClick}>Click Me</Button>);

    const buttonElement = screen.getByTestId('kux-button');
    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick handler when disabled', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    fireEvent.click(buttonElement);
    await waitFor(() => {
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  it('does not call onClick handler when loading', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} loading>Click Me</Button>);
    const buttonElement = screen.getByTestId('kux-button');
    fireEvent.click(buttonElement);
    await waitFor(() => {
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  it('renders with startIcon and endIcon', () => {
    render(
      <Button startIcon={<span>Start Icon</span>} endIcon={<span>End Icon</span>}>
        Click Me
      </Button>
    );
    const startIconElement = screen.getByText(/Start Icon/i);
    const endIconElement = screen.getByText(/End Icon/i);
    expect(startIconElement).toBeInTheDocument();
    expect(endIconElement).toBeInTheDocument();
  });

  it('renders with no icons', () => {
    render(<Button>Click Me</Button>);
    const iconElements = screen.queryAllByTestId(/icon/i);
    expect(iconElements.length).toBe(0);
  });
});