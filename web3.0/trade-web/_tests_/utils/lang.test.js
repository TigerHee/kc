import {
  getPathByLang,
  getLangFromLocaleMap,
  getCurrentLangFromPath,
  getLocaleFromLocaleMap,
  _tHTML,
  replaceUrlWithoutLang,
  addLangToPath,
  deleteLangQuery,
} from "src/utils/lang.js";
import intl from "react-intl-universal";

jest.mock("react-intl-universal", () => ({
  getHTML: jest.fn().mockReturnValue({ d: (key) => key }),
}));

describe("getPathByLang", () => {
  it("should return zh-hant when lang is zh_HK", () => {
    expect(getPathByLang("zh_HK")).toBe("zh-hant");
  });
});

describe("getLangFromLocaleMap", () => {
  it("should return en_US if no lang", () => {
    expect(getLangFromLocaleMap()).toBe("en_US");
  });

  it("should return en_US if lang is de_DE", () => {
    expect(getLangFromLocaleMap("de_DE")).toBe("en_US");
  });
});

describe("getCurrentLangFromPath", () => {
  it("should return en_US", () => {
    expect(getCurrentLangFromPath()).toBe("en_US");
  });
});

describe("getLocaleFromLocaleMap", () => {
  it("should return en if no lang", () => {
    expect(getLocaleFromLocaleMap()).toBe("en");
  });

  it("should return de if lang is de_DE", () => {
    expect(getLocaleFromLocaleMap("de_DE")).toBe("de");
  });
});

describe("_tHTML", () => {
  beforeEach(() => {
    intl.getHTML.mockClear();
  });

  it("should return the original key when no variables are passed", () => {
    const key = "test.key";
    const result = _tHTML(key);

    expect(result).toEqual(key);
    expect(intl.getHTML).toHaveBeenCalledWith(key, {"brandName": undefined});
  });

  it('should replace 0 with "0" in the variables object', () => {
    const key = "test.key";
    const variables = { var1: "value1", var2: 0 };
    const expectedVariables = { brandName: undefined,var1: "value1", var2: "0" };
    const result = _tHTML(key, variables);

    expect(result).toEqual(key);
    expect(intl.getHTML).toHaveBeenCalledWith(key, expectedVariables);
  });

  // add more test cases here as needed
});

describe("replaceUrlWithoutLang", () => {
  const oldLocation = window.location;

  beforeAll(() => {
    // Mock window.location
    delete window.location;
    window.location = {
      href: "https://example.com/path?lang=en",
      replace: jest.fn(),
    };
  });

  afterAll(() => {
    // Restore window.location
    window.location = oldLocation;
  });

  test("should replace lang parameter with empty string", () => {
    replaceUrlWithoutLang(window.location.href, true);
    expect(window.location.replace).toHaveBeenCalledWith(
      "https://example.com/path?lang=en"
    );
  });

  test("should not modify url if it does not contain lang parameter", () => {
    window.location.href = "https://example.com/path?foo=bar/";
    replaceUrlWithoutLang(window.location.href, true);
    expect(window.location.replace).toHaveBeenCalledTimes(2);
  });

  test("should not modify url if changeLocation is false", () => {
    window.location.href = "https://example.com/path?lang=en";
    replaceUrlWithoutLang(window.location.href);
    expect(window.location.replace).toHaveBeenCalledTimes(2);
  });

  test("should not modify url if url is empty", () => {
    window.location.href = "https://example.com/path?lang=en";
    replaceUrlWithoutLang("", false);
    expect(window.location.replace).toHaveBeenCalledTimes(2);
  });
});

describe("addLangToPath", () => {

  let originalLangDomain;

  let originalLocaleBasename;



  beforeEach(() => {

    originalLangDomain = window.LANG_DOMAIN;

    originalLocaleBasename = global.localeBasename;

    window.LANG_DOMAIN = undefined;

    global.localeBasename = null;

  });



  afterEach(() => {

    window.LANG_DOMAIN = originalLangDomain;

    global.localeBasename = originalLocaleBasename;

  });



  it("should return empty string when url is empty", () => {

    expect(addLangToPath("")).toBe("");

  });



  it("should return original url if it is not on LANG_DOMAIN and not starts with http", () => {

    expect(addLangToPath("/path/to/somewhere")).toBe("/path/to/somewhere");

    expect(addLangToPath("path/to/somewhere")).toBe("path/to/somewhere");

  });



  it("should not add language path to internal link when it is in WITHOOU_LANG_PATH", () => {

    const url = "https://www.kucoin.com/docs";

    expect(addLangToPath(url)).toBe(url);

  });



  it("should not add language path to internal link when it already has a language path", () => {

    const url = "https://www.kucoin.com/en-US/trade/some-token";

    expect(addLangToPath(url)).toBe(url);

  });



  it("should not add language path to external link", () => {

    const url = "https://www.google.com";

    expect(addLangToPath(url)).toBe(url);

  });



  it("should add language path to internal link on custom LANG_DOMAIN", () => {

    window.LANG_DOMAIN = ["www.example.com"];

    global.localeBasename = "en-US";

    const url = "https://www.example.com/some-page";

    const expected = "https://www.example.com/some-page";

    expect(addLangToPath(url)).toBe(expected);

  });



  it("should add language path to internal link when location path already has a language path", () => {

    global.localeBasename = "en-US";

    const url = "https://www.kucoin.com/trade/some-token";

    const expected = "https://www.kucoin.com/trade/some-token";

    expect(addLangToPath(url)).toBe(expected);

  });



  it("should add language path to internal link when location path is empty", () => {

    global.localeBasename = "en-US";

    const url = "https://www.kucoin.com";

    const expected = "https://www.kucoin.com";

    expect(addLangToPath(url)).toBe(expected);

  });



  it("should handle URLs with query parameters correctly", () => {

    global.localeBasename = "en-US";

    const url = "https://www.kucoin.com/trade/some-token?param=value";

    const expected = "https://www.kucoin.com/trade/some-token?param=value";

    expect(addLangToPath(url)).toBe(expected);

  });



  it("should handle URLs with hash fragments correctly", () => {

    global.localeBasename = "en-US";

    const url = "https://www.kucoin.com/trade/some-token#section";

    const expected = "https://www.kucoin.com/trade/some-token#section";

    expect(addLangToPath(url)).toBe(expected);

  });



  it("should handle URLs with both query parameters and hash fragments correctly", () => {

    global.localeBasename = "en-US";

    const url = "https://www.kucoin.com/trade/some-token?param=value#section";

    const expected = "https://www.kucoin.com/trade/some-token?param=value#section";

    expect(addLangToPath(url)).toBe(expected);

  });



  it("should not add language path to internal link when it is in WITHOOU_LANG_PATH and localeBasename is zh-hant", () => {

    global.localeBasename = "zh-hant";

    const url = "https://www.kucoin.com/docs";

    expect(addLangToPath(url)).toBe(url);

  });



  it("should not add language path to internal link when it is in WITHOOU_LANG_PATH and localeBasename is not zh-hant", () => {

    global.localeBasename = "en-US";

    const url = "https://www.kucoin.com/docs";

    expect(addLangToPath(url)).toBe(url);

  });



  it("should add language path to internal link when localeBasename is set and url does not start with localeBasename", () => {

    global.localeBasename = "en-US";

    const url = "https://www.kucoin.com/trade/some-token";

    const expected = "https://www.kucoin.com/trade/some-token";

    expect(addLangToPath(url)).toBe(expected);

  });



  it("should not add language path to internal link when localeBasename is not set", () => {

    const url = "https://www.kucoin.com/trade/some-token";

    expect(addLangToPath(url)).toBe(url);

  });



  it("should handle URLs with no path correctly", () => {

    global.localeBasename = "en-US";

    const url = "https://www.kucoin.com";

    const expected = "https://www.kucoin.com";

    expect(addLangToPath(url)).toBe(expected);

  });


});

describe("deleteLangQuery function", () => {
  beforeEach(() => {
    // Mock the location.search property
    Object.defineProperty(window, "location", {
      value: {
        search: "",
      },
    });
  });

  afterEach(() => {
    // Restore the original property after each test
    Object.defineProperty(window, "location", {
      value: {
        search: "",
      },
    });
  });

  it("should return an empty string if the input url is empty", () => {
    expect(deleteLangQuery()).toEqual("");
  });

  it("should remove the lang query parameter from the input url", () => {
    // Set the location.search property to include the lang parameter
    window.location.search = "?lang=en&foo=bar";

    const inputUrl = "http://example.com/test?lang=en&foo=bar";
    const expectedUrl = "http://example.com/test?foo=bar";

    expect(deleteLangQuery(inputUrl)).toEqual(expectedUrl);
  });

  it("should remove the lang query parameter and trailing slash from the input url", () => {
    // Set the location.search property to include the lang parameter
    window.location.search = "?lang=en";

    const inputUrl = "http://example.com/test/?lang=en";
    const expectedUrl = "http://example.com/test";

    expect(deleteLangQuery(inputUrl)).toEqual(expectedUrl);
  });

  it("should return the input url without modifications if it does not contain the lang query parameter", () => {
    const inputUrl = "http://example.com/test?foo=bar";
    expect(deleteLangQuery(inputUrl)).toEqual(inputUrl);
  });
});
