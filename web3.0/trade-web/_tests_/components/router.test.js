import React from 'react';
import '@testing-library/jest-dom'
import { cleanup, fireEvent, waitFor } from "@testing-library/react";
import { renderWithTheme } from '_tests_/test-setup';
import { Link, Redirect } from 'components/Router';

afterEach(cleanup)

test('test Link', () => {
  const mockFn = jest.fn();
  const { wrapper } = renderWithTheme(
  <Link to={'/trade'} onClick={mockFn}>
    <span role='btn'>click here</span>
  </Link>);
  const { container, queryByRole } = wrapper;
  expect(container).toHaveTextContent('click here');
  expect(container.querySelector('a')).toBeInTheDocument();
  fireEvent.click(queryByRole('btn'));
  waitFor(()=>{
    expect(mockFn).toHaveBeenCalledTimes(1);
  })
})

test('test Redirect', () => {
  const { wrapper } = renderWithTheme(
  <Redirect to={'/trade'}>
    <span role='btn'>click here</span>
  </Redirect>);
  const { container, queryByRole } = wrapper;
  expect(queryByRole('btn')).not.toBeInTheDocument();
  expect(container).not.toHaveTextContent('click here');
})