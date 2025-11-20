import React from "react";
import { cleanup, screen } from "@testing-library/react";

import { renderWithTheme } from "_tests_/test-setup";
import "@testing-library/jest-dom";
import CoinCodeToName from "src/trade4.0/components/CoinCodeToName/index.js";

afterEach(cleanup);

describe("CoinCodeToName", () => {
  it("renders coin list correctly", () => {
    renderWithTheme(<CoinCodeToName coin={'BTC'} />);
    expect(screen.getByText('BTC')).toBeInTheDocument();
  });
});
