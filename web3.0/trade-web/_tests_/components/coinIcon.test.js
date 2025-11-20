import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";
import CoinIcon from "src/components/common/CoinIcon";

afterEach(cleanup);

describe("CoinIcon", () => {
  it("renders empty when no currency here", () => {
    const {
      wrapper: { container },
    } = renderWithTheme(<CoinIcon currency="BTC" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders name when currency here", () => {
    const {
      wrapper: { container },
    } = renderWithTheme(<CoinIcon currency="CSP" />);
    expect(container).toHaveTextContent("CSP");
  });

  it("only renders img when showName is false", () => {
    const {
      wrapper: { container },
    } = renderWithTheme(<CoinIcon currency="CSP" showName={false} />);
    expect(container.querySelector("img")).toBeInTheDocument();
  });
});
