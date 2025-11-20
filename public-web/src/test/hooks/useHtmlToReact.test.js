/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
const { default: useHtmlToReact } = require('src/hooks/useHtmlToReact');

const TestComponent = ({ html }) => {
  const { eles } = useHtmlToReact({ html });
  console.log(React);

  return <div data-testid="content">{eles}</div>;
};

describe('useHtmlToReact', () => {
  test('should render sanitized HTML content', async () => {
    const html = '<div><span data-announcement-sub-id="123">Test Content</span></div>';

    render(<TestComponent html={html} />);

    const content = await screen.findByTestId('content');

    expect(content.innerHTML).toBe(
      '<div><span data-announcement-sub-id="123">Test Content</span></div>',
    );
  });

  test('should strip script tags from HTML content', async () => {
    const html = '<div><script>alert("xss")</script><span>Safe Content</span></div>';

    render(<TestComponent html={html} />);

    const content = await screen.findByTestId('content');

    expect(content.innerHTML).toBe('<div><span>Safe Content</span></div>');
  });

  test('should sanitize style attributes', async () => {
    const html = '<div><span style="color: red;">Styled Content</span></div>';

    render(<TestComponent html={html} />);

    const content = await screen.findByTestId('content');

    expect(content.innerHTML).toBe('<div><span style="color: red;">Styled Content</span></div>');
  });
});
