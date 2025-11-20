import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithHook } from "_tests_/test-setup";
import useAvailableBalance from "src/utils/hooks/useAvailableBalance.js";

afterEach(cleanup);

describe("useAvailableBalance", () => {
  it("should return [0, 0] when isLogin is false", () => {
    const { result } = renderWithHook(() => useAvailableBalance("currency"));
    expect(result.current).toEqual([0, "0"]);
  });

  it("should return [0, 0] when precision is undefined", () => {
    const { result } = renderWithHook(() => useAvailableBalance("currency"));
    expect(result.current).toEqual([0, "0"]);
  });

  it("should return [0, 0] when currency is CSP", () => {
    const { result } = renderWithHook(() => useAvailableBalance("CSP"));
    expect(result.current).toEqual(["0", "0"]);
  });
});
