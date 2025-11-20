import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";
import BeautifulNumber from "src/components/common/BeautifulNumber.js";

afterEach(cleanup);

test("test BeautifulNumber", () => {
  const { wrapper, rerenderWithTheme } = renderWithTheme(
    <BeautifulNumber>123</BeautifulNumber>
  );
  const { container } = wrapper;
  expect(container).toHaveTextContent("123");

  rerenderWithTheme(<BeautifulNumber>123.45</BeautifulNumber>);
  expect(container).toHaveTextContent(".45");

  rerenderWithTheme(<BeautifulNumber>123.4500</BeautifulNumber>);
  expect(container).toHaveTextContent("00");
});
