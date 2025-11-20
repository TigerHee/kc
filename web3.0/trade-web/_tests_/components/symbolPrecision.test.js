import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";
import SymbolPrecision from "src/components/common/SymbolPrecision";

afterEach(cleanup);

test("test SymbolPrecision", () => {
  const { wrapper, rerenderWithTheme } = renderWithTheme(
    <SymbolPrecision symbol="CSP-BTC" value={1234} />
  );
  const { container } = wrapper;
  expect(container).toHaveTextContent("1,234");

  rerenderWithTheme(
    <SymbolPrecision
      symbol="CSP-BTC"
      value={1234}
      precisionKey="basePrecision"
      coin={4}
    />
  );
  expect(container).toHaveTextContent("1,234");

  rerenderWithTheme(<SymbolPrecision symbol="CSP-BTC" value={1234} coin={4} />);
  expect(container).toHaveTextContent("1,234");

  rerenderWithTheme(
    <SymbolPrecision symbol="CSP-BTC" value={1234} coin={4} isBeautifulNumber fillZero />
  );
  expect(container).toHaveTextContent("1,234");

  rerenderWithTheme(<SymbolPrecision symbol="ETH-USDT" value={1235} />);
  expect(container).toHaveTextContent("1235");

  rerenderWithTheme(<SymbolPrecision symbol="SHIB-USDT" value={1234} />);
  expect(container).toHaveTextContent("1234");
});
