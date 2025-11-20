import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";
import Html from "src/components/Html";

afterEach(cleanup);

test("test Html", () => {
  const { wrapper, rerenderWithTheme } = renderWithTheme(<Html>test</Html>);
  const { container } = wrapper;
  expect(container).toHaveTextContent("test");

  rerenderWithTheme(<Html>abc</Html>);
  expect(container).toHaveTextContent("abc");
});
