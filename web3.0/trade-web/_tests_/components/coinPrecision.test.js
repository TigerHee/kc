import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";
import CoinPrecision from "src/components/common/CoinPrecision";

afterEach(cleanup);

test("test CoinPrecision", () => {
  const { wrapper, rerenderWithTheme } = renderWithTheme(
    <CoinPrecision coin={"BTC"} value={1} />
  );
  const { container } = wrapper;
  expect(container).toHaveTextContent("1");

  rerenderWithTheme(<CoinPrecision coin={"CSP"} value={10000} />);
  expect(container).toHaveTextContent("10,000");

  rerenderWithTheme(
    <CoinPrecision coin={"CSP"} value={"10000.0000"} fillZero />
  );
  expect(container).toHaveTextContent("10,000.0000");
});
