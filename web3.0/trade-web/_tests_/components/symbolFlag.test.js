import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";
import SymbolFlag from "src/components/SymbolFlag";

afterEach(cleanup);

test("test SymbolFlag", async () => {
  const { wrapper, rerenderWithTheme } = await renderWithTheme(
    <SymbolFlag symbol={"CSP-BTC"} type={"MARGIN_TRADE"} />
  );
  const { container } = wrapper;
  expect(container).toHaveTextContent("etf.short.symbol.flag");

  rerenderWithTheme(<SymbolFlag symbol={"BTC-USDT"} type={"TRADE"} />);
  expect(container).toBeEmptyDOMElement();
});
