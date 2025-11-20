import React from 'react';
import { cleanup, fireEvent, waitFor } from "@testing-library/react";
import ToolTip from "src/components/PureTooltip";
import { renderWithTheme } from '_tests_/test-setup';
import '@testing-library/jest-dom'

afterEach(cleanup)

test('test pureToolTip visible', () => {
  const { wrapper } = renderWithTheme(<ToolTip title="这里是tooltip标题" visible={true} isErrors={true}/>);
  const { container, queryByRole } = wrapper;
  expect(container).toMatchSnapshot();
  expect(container).toHaveTextContent('这里是tooltip标题');
  fireEvent.click(queryByRole('button'));
  waitFor(()=>{
    expect(container).toMatchSnapshot();
  })
})
