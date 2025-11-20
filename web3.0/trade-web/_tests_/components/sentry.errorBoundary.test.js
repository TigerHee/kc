import React from 'react'; 
import { render } from '@testing-library/react'; 
import "@testing-library/jest-dom";
import ErrorBoundary from 'components/ErrorBoundary'

describe('ErrorBoundary', () => { 
  it('renders the ErrorBoundary component', async () => { 
    const { container } = render(<ErrorBoundary><div>Test content</div></ErrorBoundary>); 
    expect(container).toBeInTheDocument(); 
    expect(container).toHaveTextContent('Test content'); 
  }); 
});
