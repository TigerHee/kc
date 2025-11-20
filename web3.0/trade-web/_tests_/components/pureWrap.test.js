import React from 'react';
import { cleanup, fireEvent, waitFor } from "@testing-library/react";
import { renderWithTheme } from '_tests_/test-setup';
import '@testing-library/jest-dom'
import PureWrap from 'src/components/common/PureWrap';

afterEach(cleanup)

const Count = ({count}) => {
  return <div>{count}</div>
};

test('test pureWrap', () => {
  const { wrapper } = renderWithTheme(<PureWrap><Count count={1}/></PureWrap>);
  const { container } = wrapper;
  expect(container).toHaveTextContent(1);
})
