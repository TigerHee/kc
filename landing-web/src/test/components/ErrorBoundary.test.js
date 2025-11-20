/*
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { render as renderDom, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from 'components/CmsComs/ErrorBoundary';

describe('ErrorBoundary', () => {
  it('displays custom UI when an error occurs', () => {
    const CustomErrorUI = () => <div>Oops! Something went wrong.</div>;
    const { container } = render(
      <ErrorBoundary>
        <ChildComponent />
      </ErrorBoundary>,
      { wrapper: CustomErrorUI },
    );
    expect(container).toContainHTML('<div>Oops! Something went wrong.</div>');
  });
});

// This is a mock child component that will throw an error when rendered
const ChildComponent = () => {
  throw new Error('Oops! Something went wrong.');
};
