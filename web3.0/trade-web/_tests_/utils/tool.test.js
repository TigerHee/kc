import Decimal from "decimal.js";
import { toBoolean, numberFixed, getUrlSymbolCode } from "utils/tools";

expect.extend({
  decimalEquals(received, argument) {
    const pass = Decimal(received).equals(argument);
    if (pass) {
      return {
        message: () => `expected Decimal ${received} to be Decimal ${argument}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected Decimal ${received} not to be Decimal ${argument}`,
        pass: false,
      };
    }
  },
});

describe("toBoolean 转化为boolean值", () => {
  test("参数为number", () => {
    expect(toBoolean(0)).toBeTruthy();
    expect(toBoolean(0, false)).toBeFalsy();
    expect(toBoolean(1)).toBeTruthy();
    expect(toBoolean(1, false)).toBeFalsy();
  });
  test("参数为string", () => {
    expect(toBoolean("a")).toBeTruthy();
    expect(toBoolean("a", false)).toBeFalsy();
    expect(toBoolean("")).toBeTruthy();
    expect(toBoolean("", false)).toBeFalsy();
  });
  test("参数为boolean", () => {
    expect(toBoolean(true)).toBeTruthy();
    expect(toBoolean(true, false)).toBeTruthy();
    expect(toBoolean(false)).toBeFalsy();
    expect(toBoolean(false, false)).toBeFalsy();
  });
});

describe("numberFix 高精度指定位数", () => {
  test("参数合法", () => {
    expect(numberFixed(1.34567, 2)).decimalEquals(1.34);
    expect(numberFixed("-341.342132", 0)).decimalEquals(-341);
  });
  test("参数不合法", () => {
    expect(numberFixed("test", 2)).toBe("test");
    expect(numberFixed(undefined, 2)).toBe(undefined);
  });
});

describe("getUrlSymbolCode", () => {
  test("getUrlSymbolCode returns correct symbol code", () => {
    // Mock the window.location.pathname value
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/path/to/symbol/ABC-123",
      },
      writable: true,
    });

    expect(getUrlSymbolCode()).toEqual("ABC-123");
  });

  test("getUrlSymbolCode returns undefined for non-symbol path", () => {
    // Mock the window.location.pathname value
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/path/to/page",
      },
      writable: true,
    });

    expect(getUrlSymbolCode()).toBeUndefined();
  });
});
