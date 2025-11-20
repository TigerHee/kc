import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";
import ErrorBoundary from "src/components/CmsComs/ErrorBoundary";

afterEach(cleanup);

test("test ErrorBoundary no error", () => {
  const { wrapper } = renderWithTheme(
    <ErrorBoundary>1234</ErrorBoundary>
  );
  const { container } = wrapper;
  expect(container).toHaveTextContent("1234");
});


test("test ErrorBoundary has Error", () => {
  const ChildWithError = () => {
    throw new Error('Test Error');
  };

  const { wrapper } = renderWithTheme(
    <ErrorBoundary>
      <ChildWithError />
    </ErrorBoundary>
  );
  const { container } = wrapper;
  expect(container).toBeEmptyDOMElement();
});
