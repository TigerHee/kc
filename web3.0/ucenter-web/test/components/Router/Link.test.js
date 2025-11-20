import { fireEvent } from '@testing-library/react';
import { Link } from 'src/components/Router';
import { customRender } from 'test/setup';
import { getUtmLink } from 'utils/getUtm';
import { push } from 'utils/router';

jest.mock('utils/getUtm', () => ({
  getUtmLink: jest.fn((link) => link),
}));

jest.mock('utils/router', () => ({
  push: jest.fn(),
}));

describe('Link Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children correctly', () => {
    const { getByText } = customRender(<Link to="/example">Click me</Link>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('handles click event correctly without dontGoWithHref', () => {
    const { getByText } = customRender(<Link to="/example">Click me</Link>);
    const link = getByText('Click me');
    fireEvent.click(link);
    expect(push).toHaveBeenCalledWith('/example');
  });

  it('handles click event correctly with dontGoWithHref', () => {
    const { getByText } = customRender(
      <Link to="/example" dontGoWithHref>
        Click me
      </Link>,
    );
    const link = getByText('Click me');
    fireEvent.click(link);
    expect(push).not.toHaveBeenCalled();
  });

  it('generates correct href for external link', () => {
    const { getByText } = customRender(<Link href="http://example.com">External Link</Link>);
    const link = getByText('External Link');
    fireEvent.click(link);
    expect(getUtmLink).toHaveBeenCalledWith('http://example.com');
    expect(push).toHaveBeenCalledWith('http://example.com');
  });

  it('renders href correctly when passing href prop', () => {
    const { getByText } = customRender(<Link href="http://example.com">External Link</Link>);
    const link = getByText('External Link');
    expect(link).toHaveAttribute('href', 'http://example.com');
  });
});
