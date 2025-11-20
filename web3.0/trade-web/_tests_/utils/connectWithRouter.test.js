import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";

import connectWithRouter from "src/utils/connectWithRouter.js";

afterEach(cleanup);

describe("connectWithRouter", () => {
  const TestComponent = () => <div>Test Component</div>;
  const history = createMemoryHistory();
  it("should render connected component with router", () => {
    const ConnectedComponent = connectWithRouter()(TestComponent);

    const {
      wrapper: { getByText },
    } = renderWithTheme(
      <Router history={history}>
        <Route path="/" component={ConnectedComponent} />
      </Router>
    );
    expect(getByText("Test Component")).toBeInTheDocument();
  });
});
