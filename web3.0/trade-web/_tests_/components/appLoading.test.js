import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";

import AppLoading from "src/components/AppLoading";

afterEach(cleanup);
describe("AppLoading", () => {
  it("should render", () => {
    const {
      wrapper: { container },
    } = renderWithTheme(<AppLoading />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should display a rotating image", () => {
    const {
      wrapper: { container },
    } = renderWithTheme(<AppLoading />);
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
  });
});
